import React from "react";

class HubspotForm extends React.Component{
  constructor() { 
    super()
    this.formRef = React.createRef();
  }

  componentDidMount() {
    const script = document.createElement("script");
    script.src = "https://js.hsforms.net/forms/v2.js";
    document.body.appendChild(script);

    script.addEventListener("load", () => {
      // @ts-ignore
      if (window.hbspt) {
        // @ts-ignore
        window.hbspt.forms.create({
          target: "#hubspotForm",
          ...this.props,
          onFormReady: this.onFormReady,
          submitButtonClass: "leaderboard-alias-submit-button"
        });
      }
    });
  }

  onFormReady = (form) => { 
    const spans = form.querySelectorAll("span");
    const legends = form.querySelectorAll(".hs-field-desc");
    const buttons = form.querySelectorAll(".leaderboard-alias-submit-button");

    const emailElement = spans[0];
    const usernameElement = spans[2]
    const addressElement = spans[4]
    const label = legends[1]

    console.log(buttons)

    const styles = getComputedStyle(document.documentElement);

    const bgColor = styles.getPropertyValue('--secondary-color');
    const textColor = styles.getPropertyValue('--primary-color');

    emailElement.style.color = bgColor;
    usernameElement.style.color = bgColor;
    addressElement.style.color = bgColor;
    
    label.style.color = bgColor;
    label.style.opacity = 0.7;

    buttons[0].style.backgroundColor = bgColor;
    buttons[0].style.border = "none";
    buttons[0].style.color = textColor;
    buttons[0].style.padding = '8px';
    buttons[0].style.borderRadius = '5px';
    buttons[0].style.cursor = 'pointer';
  }

  render() {
    return (
      <div>
        <div ref={this.formRef} id="hubspotForm" />
      </div>
    );
  }
}

export default HubspotForm;