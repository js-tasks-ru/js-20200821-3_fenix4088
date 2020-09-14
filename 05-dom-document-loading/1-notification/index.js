export default class NotificationMessage {
    element;
    static notificationStatus;
  
    constructor(messageText, { duration = 2000, type = 'success' } = {}) {
      if(NotificationMessage.notificationStatus) {
          NotificationMessage.notificationStatus.remove(); 
      }
      this.messageText = messageText;
      this.duration = duration;
      this.type = type;
      this.render();
    }
  
    get markup() {
      return `
          <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
          <div class="timer"></div>
          <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
              ${this.messageText}
          </div>
          </div>
      </div>
        `;
    }
  
    render() {
      const element = document.createElement("div");
      element.innerHTML = this.markup;
      this.element = element.firstElementChild;
  
      NotificationMessage.notificationStatus = this.element;
  
    }
  
    show(target = document.body) {
      target.append(this.element);
      setTimeout(() => {
        this.remove();
        this.destroy();
      }, this.duration);
    }
  
    remove() {
      this.element.remove();
    }
  
    destroy() {
      this.element = null;
      NotificationMessage.notificationStatus = null;
    }
  }
  