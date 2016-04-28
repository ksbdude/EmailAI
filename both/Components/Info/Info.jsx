import React from 'react';

Info = React.createClass({
  //TODO:
  // 'click #myButton': function(event, template) {
  //   event.preventDefault();
  //   Router.go('anotherpath');
  render(){
    return(
      <div className="container-default">
        <div className="well">
          <h1 className="text-center">Info</h1>
          <br />
          <h3 className="text-center">Development</h3>
          <p>
            Developed by Kevin Burns <a href="https://github.com/ksbdude">(@ksbdude)</a> and Brett Henderson <a href="https://github.com/bretth18">(@bretth18)</a> This project was part of the DeveloperWeek SF 2016 Hackathon. <a>http://accelerate.im/projects/397</a>        As part of the challenge driven hackathon, we focused our project around using the Sparkpost API, and IBM's Watson API.
            <li>Sparkpost: <a>https://developers.sparkpost.com/api/</a> </li>
            <li>IBM Watson: <a>https://developer.ibm.com/watson/</a> </li>
            <br /> emailAssistant is developed on top of the Meteor.js stack.
            <li> Meteor.js: <a>https://www.meteor.com/</a> </li>
          </p>
          <div>
            <h3>Contact</h3>
            <li>Kevin Burns: <a href="https://twitter.com/ksbdude"><img className="fa fa-twitter" /></a></li>
            <li>Brett Henderson: <a href="https://twitter.com/brett_h18"><img className="fa fa-twitter" /></a></li>
          </div>
        </div>
      </div>

    );
  }
});
