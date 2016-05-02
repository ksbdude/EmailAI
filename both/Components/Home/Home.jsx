import React from 'react';

Home = React.createClass({
  render(){
    return(
      <div className="template-home">
        <div className="page-header">
          <h1>emailAI</h1>
        </div>
        <div className="container-fluid">
          <div className="well text-center">
            <img id="brand-image" src="https://cloud.githubusercontent.com/assets/955730/13084450/4d9e6866-d48e-11e5-88b6-8cf6482c0709.png" className="img-responsive center-block" />
            <h4>Welcome</h4>
              <p>
                <li> emailAssistant (or emailAI) is currently a backend service that can be used to proofread emails, essays, etc.</li>
                <li> Our platform analyzes emotional context used within text and returns the analytical results to the user. </li>
              </p>
              <button className="btn btn-info btn-raised" href="/info" id="info-button">Learn More</button>
              <a className="btn btn-warning btn-raised" href="mailto:demo@inbound.idbolt.io">Demo</a>
              <a className="btn btn-info btn-raised" href="https://github.com/ksbdude/EmailAI" id="info-button"><i className="fa fa-github" aria-hidden="true"></i>
    GitHub</a>
          </div>
        </div>
      </div>
    );
  }
});
