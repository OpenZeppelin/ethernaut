import React from "react";
import Filter from "bad-words"
import { useToast } from "../utils/Toast";

const filter = new Filter()

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
          submitButtonClass: "leaderboard-alias-submit-button",
          onFormSubmitted: this.onFormSubmitted
        });
      }
    });
  }

  onFormReady = (form) => { 
    const spans = form.querySelectorAll("span");
    const legends = form.querySelectorAll(".hs-field-desc");
    const buttons = form.querySelectorAll(".leaderboard-alias-submit-button");
    const inputs = form.querySelectorAll("input");

    const emailElement = spans[0]
    const usernameElement = spans[2]
    const addressElement = spans[4]
    const label = legends[1]
    const addressInput = inputs[3]

    const styles = getComputedStyle(document.documentElement);

    const textColor = styles.getPropertyValue('--secondary-color');
    const bgColor = styles.getPropertyValue('--primary-color');

    emailElement.style.color = textColor;
    usernameElement.style.color = textColor;
    addressElement.style.color = textColor;
    
    label.style.color = textColor;
    label.style.opacity = 0.7;

    buttons[0].style.backgroundColor = textColor;
    buttons[0].style.border = "none";
    buttons[0].style.color = bgColor;
    buttons[0].style.padding = '8px';
    buttons[0].style.borderRadius = '5px';
    buttons[0].style.cursor = 'pointer';

    addressInput.disabled = true;
    addressInput.value = this.props.currentUser;

    form.addEventListener('submit', (event) => { 
      const alias = event.srcElement[1].value
      if (filter.isProfane(alias)) { 
        this.props.toast("Please don't use offensive words in your alias")
        event.stopPropagation()
      }
    })
  }

  onFormSubmitted = (form) => { 
    const styles = getComputedStyle(document.documentElement);
    const textColor = styles.getPropertyValue('--secondary-color');
    form.style.color = textColor;
  }

  render() {
    return (
      <>
        <div>
          <div ref={this.formRef} id="hubspotForm" />
        </div>
      </>
    );
  }
}


function WithToast(Component) {
  return function WrappedComponent(props) {
    const { Toast, toast } = useToast(2)
    return (
      <>
        {Toast}
        <Component toast={toast} {...props} />
      </>
    );
  };
}

export default WithToast(HubspotForm);