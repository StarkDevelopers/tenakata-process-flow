class USSDMenu {
  constructor(menuText = '', selectText = '', ...menuOptions) {
    this.menuText = menuText;
    this.selectText = selectText;
    this.menuOptions = menuOptions || [];
  }

  menu(menuText) {
    this.menuText = menuText;
    return this;
  }

  setSelectText(selectText) {
    this.selectText = selectText;
    return this;
  }

  option(option) {
    this.menuOptions.push(option);
    return this;
  }

  build() {
    let menuString = this.menuText;

    if (this.selectText) {
      menuString += `\n${this.selectText}`;
    }

    if (this.menuOptions.length) {
      menuString += '\n';
      menuString += this.menuOptions.join('\n');
    }

    return menuString;
  }
}

module.exports = USSDMenu;
