import fetchJson from "./utils/fetch-json.js";

const BACKEND_URL = "https://course-js.javascript.ru";

export default class SortableTable {
  element;
  subElements = {};
  data = [];

  loading = false;
  step = 30;
  infinityScrollState = {
    start: 0,
    end: this.step,
  };

  constructor(
    headersConfig = [],
    {
      url = "",
      sorted = {
        id: headersConfig.find((item) => item.sortable).id,
        order: "asc",
      },
      isSortLocally = false,
    } = {}
  ) {
    this.headersConfig = headersConfig;
    this.url = new URL(url, BACKEND_URL);
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;

    this.render();
  }

  scrollindTable = async () => {
    const pageParams = this.element.getBoundingClientRect();
    const pageHeight = document.documentElement.clientHeight;
    const { id, order } = this.sorted;

    if (
      pageParams.bottom < pageHeight &&
      !this.loading &&
      !this.isSortLocally
    ) {
      this.loading = true;

      const data = await this.loadData(id, order);
      this.update(data);

      this.loading = false;
    }
  };

  clickTableHeader = (event) => {
    const column = event.target.closest('[data-sortable="true"]');
    const toggleOrder = (order) => {
      const orders = {
        asc: "desc",
        desc: "asc",
      };

      return orders[order];
    };

    if (column) {
      const { id, order } = column.dataset;
      const newOrder = toggleOrder(order);

      this.sorted = {
        id,
        order: newOrder,
      };

      column.dataset.order = newOrder;
      column.append(this.subElements.arrow);

      if (this.isSortLocally) {
        this.sortLocally(id, newOrder);
      } else {
        this.sortOnServer(id, newOrder);
      }
    }
  };

  initEventListeners() {
    this.subElements.header.addEventListener(
      "pointerdown",
      this.clickTableHeader
    );
    document.addEventListener("scroll", this.scrollindTable);
  }

  async render() {
    const { id, order } = this.sorted;
    const wrapper = document.createElement("div");

    wrapper.innerHTML = this.createTable();

    const element = wrapper.firstElementChild;

    this.element = element;
    this.subElements = this.getSubElements(element);

    const response = await this.loadData(id, order);

    this.renderRows(response);
    this.initEventListeners();
  }

  createTable() {
    return `
      <div class="sortable-table">
        ${this.createTableHeader()}
        ${this.createTableBody(this.data)}
        <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
        <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
          No products
        </div>
      </div>`;
  }

  createTableHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.headersConfig.map((item) => this.createHeaderRow(item)).join("")}
    </div>`;
  }

  createHeaderRow({ id, title, sortable }) {
    const order = this.sorted.id === id ? this.sorted.order : "asc";

    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${order}">
        <span>${title}</span>
        ${this.createHeaderSortingArrow(id)}
      </div>
    `;
  }

  createHeaderSortingArrow(id) {
    const isOrderExist = this.sorted.id === id ? this.sorted.order : "";

    return isOrderExist
      ? `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>`
      : "";
  }

  createTableBody(data) {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.createTableRows(data)}
      </div>`;
  }

  createTableRows(data) {
    return data
      .map((item) => {
        if (item.images.length !== 0) {
          return `<div class="sortable-table__row">
            ${this.createTableRow(item, data)}
        </div>`;
        }
      })
      .join("");
  }

  createTableRow(item) {
    const cells = this.headersConfig.map(({ id, template }) => {
      return {
        id,
        template,
      };
    });

    return cells
      .map(({ id, template }) => {
        return template
          ? template(item[id])
          : `<div class="sortable-table__cell">${item[id]}</div>`;
      })
      .join("");
  }

  sortData(id, order) {
    const arr = [...this.data];
    const column = this.headersConfig.find((item) => item.id === id);
    const { sortType, customSorting } = column;
    const direction = order === "asc" ? 1 : -1;

    return arr.sort((a, b) => {
      switch (sortType) {
        case "number":
          return direction * (a[id] - b[id]);
        case "string":
          return direction * a[id].localeCompare(b[id], "ru");
        case "custom":
          return direction * customSorting(a, b);
        default:
          return direction * (a[id] - b[id]);
      }
    });
  }

  async loadData(id, order) {
    this.element.classList.add("sortable-table_loading");

    const newUrl = this.getURL(id, order);
    const response = await fetchJson(newUrl);
    if (response.length !== 0) {
      this.infinityScrollState.start += this.step;
      this.infinityScrollState.end += this.step;
    }

    this.element.classList.remove("sortable-table_loading");

    return response;
  }

  getURL(id, order) {
    const newUrl = this.url;
    newUrl.searchParams.set("_sort", id);
    newUrl.searchParams.set("_order", order);
    newUrl.searchParams.set("_start", this.infinityScrollState.start);
    newUrl.searchParams.set("_end", this.infinityScrollState.end);
    return newUrl.href;
  }

  renderRows(data) {
    if (data.length) {
      this.element.classList.remove("sortable-table_empty");
      this.addRows(data);
    } else {
      this.element.classList.add("sortable-table_empty");
    }
  }

  addRows(data) {
    this.data = data;

    this.subElements.body.innerHTML = this.createTableRows(data);
  }

  sortLocally(id, order) {
    const sortedData = this.sortData(id, order);

    this.subElements.body.innerHTML = this.createTableBody(sortedData);
  }

  async sortOnServer(id, order) {
    const data = await this.loadData(id, order);

    this.renderRows(data);
  }

  getSubElements(element) {
    const elements = element.querySelectorAll("[data-element]");

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  update(data) {
    const rows = document.createElement("div");

    this.data = [...this.data, ...data];
    rows.innerHTML = this.createTableRows(data);

    this.subElements.body.append(...rows.childNodes);
  }

  remove() {
    this.element.remove();
    document.removeEventListener("scroll", this.scrollindTable);
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}
