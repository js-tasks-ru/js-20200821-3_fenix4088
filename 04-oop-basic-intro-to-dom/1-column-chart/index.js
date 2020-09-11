export default class ColumnChart {
    chartHeight = 50;
    markupWrapper = {}
  
    constructor(obj = {}) {
      this.data = obj.data || [];
      this.label = obj.label || "";
      this.value = obj.value;
      this.link = obj.link;
  
      this.render();
      this.renderLink();
    }
  
    render() {
      const element = document.createElement("div");
      element.innerHTML = this.markup;
  
      this.element = element.firstElementChild;
      if (this.data.length) {
        this.element.classList.remove("column-chart_loading");
      }
  
      this.markupWrapper = this.getMarkupWrapper(this.element);
    }
  
    get markup() {
      return `   
      <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__title">
        Total ${this.label}
      </div>
      <div class="column-chart__container">
      <div class="column-chart__header">${this.value}</div>
      <div data-element="body" class="column-chart__chart">
        ${this.createChartElements(this.data)}
      </div>
      </div>
    </div>`;
    }
  
    renderLink() {
      const linkMarkup = `<a href="/sales" class="column-chart__link">View all</a>`;
      if (this.link) {
        const title = this.element.querySelector(".column-chart__title");
        title.innerHTML = `Total ${this.label} ${linkMarkup}`;
      }
    }
  
    createChartElements(data) {
      const maxNumber = Math.max(...data);
  
      const newElement = data.map((dataItem) => {
  
          let value = Math.floor((dataItem * this.chartHeight) / maxNumber);
          let percent = ((dataItem * 100) / maxNumber).toFixed(0);
  
          return `<div style="--value:${value}" data-tooltip="${percent}%"></div>`;
  
        }).join("");
  
        return newElement;
    }
  
    getMarkupWrapper(element) {
      const markupWrappers = element.querySelectorAll('[data-element]');
      return [...markupWrappers].reduce((acc, markupWrapper) => {
        acc[markupWrapper.dataset.element] = markupWrapper;
  
        return acc;
      }, {});
    }
  
    update(data = []) {
      this.data = data;
      this.markupWrapper.body.innerHTML = this.createChartElements(data)
    }
  
    remove() {
      this.element.remove();
    }
  
    destroy() {
      this.remove();
      this.element = null;
    }
  }
  