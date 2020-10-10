export default class RangePicker {
  element = null;
  subElements = {};
  selectingFrom = true;
  selected = {
    from: new Date(),
    to: new Date(),
  };

  static formatDate(date) {
    const newDate = date.toLocaleString("ru", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      timezone: "UTC",
    });
    return newDate;
  }

  constructor({ from = new Date(), to = new Date() } = {}) {
    this.selected = { from, to };
    this.showDateFrom = new Date(from);
    this.render();
  }

  initEventListeners() {
    const { input, selector } = this.subElements;

    document.addEventListener("click", this.onDocumentClick, true);
    input.addEventListener("click", () => this.toggle());
    selector.addEventListener("click", this.onSelectorClick);
  }

  toggle() {
    this.element.classList.toggle("rangepicker_open");
    this.renderDateRangePicker();
  }

  onDocumentClick = (event) => {
    const isOpen = this.element.classList.contains("rangepicker_open");
    const isRangePicker = this.element.contains(event.target);

    if (isOpen && !isRangePicker) {
      this.close();
    }
  };

  close() {
    this.element.classList.remove("rangepicker_open");
  }

  onSelectorClick = (event) => {
    const target = event.target;
    if (target.classList.contains("rangepicker__cell")) {
      this.onRangePickerCellClick(target);
    }
  };

  onRangePickerCellClick(target) {
    const { value } = target.dataset;
    if (value) {
      const dateValue = new Date(value);

      if (this.selectingFrom) {
        this.selected = {
          from: dateValue,
          to: null,
        };
        this.selectingFrom = false;
        this.renderHighlight();
      } else {
        if (dateValue > this.selected.from) {
          this.selected.to = dateValue;
        } else {
          this.selected.to = this.selected.from;
          this.selected.from = dateValue;
        }
        this.selectingFrom = true;
        this.renderHighlight();
      }

      if (this.selected.from && this.selected.to) {
        this.dispatchEvent();
        this.close();
        this.subElements.from.innerHTML = RangePicker.formatDate(
          this.selected.from
        );
        this.subElements.to.innerHTML = RangePicker.formatDate(
          this.selected.to
        );
      }
    }
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;

    this.subElements = this.getSubElements(this.element);
    this.initEventListeners();
  }

  get template() {
    return `
            <div class="rangepicker">
                    <div class="rangepicker__input" data-element="input">
                            <span data-element="from">${RangePicker.formatDate(
                              this.selected.from
                            )}</span> -
                            <span data-element="to">${RangePicker.formatDate(
                              this.selected.to
                            )}</span>
                    </div>
                    <div class="rangepicker__selector" data-element="selector"></div>
            </div>
            `;
  }

  renderDateRangePicker() {
    const showDate1 = new Date(this.showDateFrom);
    const showDate2 = new Date(this.showDateFrom);
    const { selector } = this.subElements;

    showDate2.setMonth(showDate2.getMonth() + 1);

    selector.innerHTML = `
                <div class="rangepicker__selector-arrow"></div>
                <div class="rangepicker__selector-control-left"></div>
                <div class="rangepicker__selector-control-right"></div>
                ${this.renderCalendar(showDate1)}
                ${this.renderCalendar(showDate2)}
        `;

    const controlLeft = selector.querySelector(
      ".rangepicker__selector-control-left"
    );
    const controlRight = selector.querySelector(
      ".rangepicker__selector-control-right"
    );

    controlLeft.addEventListener("click", this.prev);
    controlRight.addEventListener("click", this.next);

    this.renderHighlight();
  }

  renderCalendar(showDate) {
    const date = new Date(showDate);
    const getGridStartIndex = (dayIndex) => {
      const index = dayIndex === 0 ? 6 : dayIndex - 1; // make Sunday (0) the last day
      return index + 1;
    };
    date.setDate(1);

    const monthStr = date.toLocaleString("ru", { month: "long" });

    let table = `
        <div class="rangepicker__calendar">
                <div class="rangepicker__month-indicator">
                        <time datetime="${monthStr}">${monthStr}</time>
                </div>
                <div class="rangepicker__day-of-week">
                        <div>Пн</div>
                        <div>Вт</div>
                        <div>Ср</div>
                        <div>Чт</div>
                        <div>Пт</div>
                        <div>Сб</div>
                        <div>Вс</div>
                </div>
        <div class="rangepicker__date-grid">
    `;
    // first day of month starts after a space
    table += `
    <button 
    type="button" 
    class="rangepicker__cell" 
    data-value="${date.toISOString()}" style="--start-from: ${getGridStartIndex(
      date.getDay()
    )}">${date.getDate()}</button>
    `;

    date.setDate(2);

    while (date.getMonth() === showDate.getMonth()) {
      table += `
            <button 
            type="button" 
            class="rangepicker__cell" 
            data-value="${date.toISOString()}">${date.getDate()}</button>
            `;

      date.setDate(date.getDate() + 1);
    }
    table += `</div></div>`;
    return table;
  }

  prev = () => {
    this.showDateFrom.setMonth(this.showDateFrom.getMonth() - 1);
    this.renderDateRangePicker();
  };

  next = () => {
    this.showDateFrom.setMonth(this.showDateFrom.getMonth() + 1);
    this.renderDateRangePicker();
  };
  renderHighlight() {
    const { from, to } = this.selected;
    const { selector } = this.subElements;
    const cellsCollection = selector.querySelectorAll(".rangepicker__cell");
    [...cellsCollection].forEach((cell) => {
      const { value } = cell.dataset;
      const cellDate = new Date(value);
      cell.classList.remove("rangepicker__selected-from");
      cell.classList.remove("rangepicker__selected-between");
      cell.classList.remove("rangepicker__selected-to");

      if (from && from.toISOString() === value) {
        cell.classList.add("rangepicker__selected-from");
      } else if (to && to.toISOString() === value) {
        cell.classList.add("rangepicker__selected-to");
      } else if (from && to && cellDate >= from && cellDate <= to) {
        cell.classList.add("rangepicker__selected-between");
      }
    });

    if (from) {
      const selectedFromElem = selector.querySelector(
        `[data-value="${from.toISOString()}"]`
      );
      if (selectedFromElem) {
        selectedFromElem
          .closest(".rangepicker__cell")
          .classList.add("rangepicker__selected-from");
      }
    }

    if (to) {
      const selectedToElem = selector.querySelector(
        `[data-value="${to.toISOString()}"]`
      );
      if (selectedToElem) {
        selectedToElem
          .closest(".rangepicker__cell")
          .classList.add("rangepicker__selected-to");
      }
    }
  }

  getSubElements(element) {
    const elements = element.querySelectorAll("[data-element]");
    return [...elements].reduce((acc, next) => {
      acc[next.dataset.element] = next;
      return acc;
    }, {});
  }

  dispatchEvent() {
    this.element.dispatchEvent(
      new CustomEvent("date-select", {
        bubbles: true,
        detail: this.selected,
      })
    );
  }

  remove() {
    this.element.remove();
    // TODO: Warning! To remove listener  MUST be passes the same event phase
    document.removeEventListener("click", this.onDocumentClick, true);
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
    this.selectingFrom = true;
    this.selected = {
      from: new Date(),
      to: new Date(),
    };

    return this;
  }
}
