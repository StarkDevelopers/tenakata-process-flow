class USSDMenu {
  constructor(menuText = '', selectText = '', endText = '', ...menuOptions) {
    this.menuText = menuText;
    this.selectText = selectText || [];
    this.menuOptions = menuOptions || [];
    this.endText = endText || [];
  }

  menu(menuText) {
    this.menuText = menuText;
    return this;
  }

  setSelectText(selectText) {
    this.selectText.push(selectText);
    return this;
  }

  option(option) {
    this.menuOptions.push(option);
    return this;
  }

  setEndText(endText) {
    this.endText.push(endText);
    return this;
  }

  build() {
    let menuString = this.menuText;

    if (this.selectText.length) {
      menuString += '\n';
      menuString += this.selectText.join('\n');
    }

    if (this.menuOptions.length) {
      menuString += '\n';
      menuString += this.menuOptions.join('\n');
    }


    if (this.endText.length) {
      menuString += '\n';
      menuString += this.endText.join('\n');
    }

    return menuString;
  }
}

module.exports = USSDMenu;
