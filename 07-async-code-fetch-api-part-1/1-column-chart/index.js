import fetchJSON from "./utils/fetch-json.js";

const SourceURL = `https://course-js.javascript.ru`;

export default class ColumnChart {
  chartHeight = 50;
  subElements = {};

  constructor({
    label = "",
    url = "",
    link = "",
    range = {
      from: new Date(),
      to: new Date(),
    },
    formatHeading = (data) => `$${data}`,
  } = {}) {
    this.label = label;
    this.url = new URL(url, SourceURL);
    this.link = link;
    this.range = range;
    this.formatHeading = formatHeading;

    this.render();
    this.renderLink();
    this.requestData(this.range.from, this.range.to);
  }

  render() {
    const element = document.createElement("div");
    element.innerHTML = this.markup;

    this.element = element.firstElementChild;

    this.subElements = this.getSubElements(this.element);
  }

  get markup() {
    return `   
      <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__title">
        Total ${this.label}
      </div>
      <div class="column-chart__container">
      <div data-element="header" class="column-chart__header">
      </div>
      <div data-element="body" class="column-chart__chart">
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

  getSubElements(element) {
    const subElements = element.querySelectorAll("[data-element]");
    return [...subElements].reduce((acc, subElement) => {
      acc[subElement.dataset.element] = subElement;

      return acc;
    }, {});
  }

  getURL(from, to) {
    const newUrl = this.url;
    newUrl.searchParams.set("from", from.toISOString());
    newUrl.searchParams.set("to", to.toISOString());
    return newUrl.href;
  }

  async requestData(from, to) {
    const newUrl = this.getURL(from, to);
    const response = await fetchJSON(newUrl);

    this.setNewRange(from, to);

    if (Object.values(response).length) {
      this.element.classList.remove("column-chart_loading");
    }

    this.subElements.header.textContent = this.getTotalDataAmount(
      Object.values(response)
    );
    this.subElements.body.innerHTML = this.createChartElements(
      Object.values(response)
    );
  }

  setNewRange(from, to) {
    this.range.from = from;
    this.range.to = to;
  }

  getTotalDataAmount(data = []) {
    let totalAmount = data.reduce((acc, nextVal) => {
      return acc + nextVal;
    });

    return this.label === "sales" ? this.formatHeading(totalAmount) : totalAmount;
  }

  async update(from, to) {
    return await this.requestData(from, to);
  }

  destroy() {
    this.element.remove();
  }
}
