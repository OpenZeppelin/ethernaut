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
          onFormReady: this.onFormReady
        });
      }
    });
  }

  onFormReady = (form) => { 
    const spans = form.querySelectorAll("span");
    const legends = form.querySelectorAll(".hs-field-desc");

    const emailElement = spans[0];
    const usernameElement = spans[2]
    const addressElement = spans[4]
    const label = legends[1]

    console.log(legends)

    const styles = getComputedStyle(document.documentElement);

    const bgColor = styles.getPropertyValue('--secondary-color');

    emailElement.style.color = bgColor;
    usernameElement.style.color = bgColor;
    addressElement.style.color = bgColor;
    label.style.color = bgColor;
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