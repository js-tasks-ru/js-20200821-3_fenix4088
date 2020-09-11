
export default class SortableTable {
    element;
    constructor(tableHeader, tableData = []) {
        this.tableHeader = tableHeader;
        this.tableData = tableData;
        this.render();
    }
  
    render() {
        const element = document.createElement('div');
        element.innerHTML = this.createTable(this.tableData.data);
        this.element = element.firstElementChild;
  
        this.element = element;
        this.subElements = this.getSubElements(element);
    }
  
    createTable(data) {
        return `
            <div class="sortable-table">
                ${this.createTableHeader()}
                ${this.createTableBody(data)}
            </div>
        `;
    }
  
    createTableHeader() {
        return ` 
            <div data-element="header" class="sortable-table__header sortable-table__row">
                ${this.tableHeader.map( item => this.createHeaderRow(item)).join("")}
            </div>
        `;
    }
  
    createHeaderRow(obj) {
        return `
        <div class="sortable-table__cell" data-id="${obj.id}" data-sortable="${obj.sortable}">
            <span>${obj.title}</span>
            ${this.createHeaderSortingArrow()}
        </div>
        `;
    }
  
    createHeaderSortingArrow() {
        return `
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
        `;
    }
  
    createTableBody(data) {
        return `
        <div data-element="body" class="sortable-table__body">
            ${this.createTableRows(data)}
        </div
        `;
    }
  
    createTableRows(data) {
        return data.map(item => {
            return `
                <div class="sortable-table__row">
                    ${this.createTableRow(item, data)}
                </div>
            `
        }).join("");
    }
  
    createTableRow(item) {
        const cells = this.tableHeader.map(({id, template}) => {
            return {id, template};
        });
  
        return cells.map(({id, template}) => {
            return template ? template(item[id]) : `<div class="sortable-table__cell">${item[id]}</div>`;
        }).join('');
    }
  
    sort (field, order) {
        const sortedData = this.sortData(field, order);
        const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
        const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);
    
        // NOTE: Remove sorting arrow from other columns
        allColumns.forEach(column => {
          column.dataset.order = '';
        });
    
        currentColumn.dataset.order = order;
    
        this.subElements.body.innerHTML = this.createTableRows(sortedData);
    }
  
    sortData(field, order) {
        const arr = [...this.tableData.data];
        const column = this.tableHeader.find(item => item.id === field);
        const {sortType, customSorting} = column;
        const direction = order === 'asc' ? 1 : -1;
    
        return arr.sort((a, b) => {
          switch (sortType) {
            case 'number':
              return direction * (a[field] - b[field]);
            case 'string':
              return direction * a[field].localeCompare(b[field], 'ru');
            case 'custom':
              return direction * customSorting(a, b);
            default:
              return direction * (a[field] - b[field]);
          }
        });
      }
  
      getSubElements(element) {
        const elements = element.querySelectorAll('[data-element]');
    
        return [...elements].reduce((accum, subElement) => {
          accum[subElement.dataset.element] = subElement;
          return accum;
        }, {});
      }
    
      remove() {
        this.element.remove();
      }
    
      destroy() {
        this.remove();
        this.subElements = {};
      }
  
  
  }
  
  