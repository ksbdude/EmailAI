import React from 'react';

MainLayout = React.createClass({
  render() {
    return (
      <div>
        <meta content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no" name="viewport" />
        <Header />
        <main className="container">{this.props.content}</main>
        <Footer />
      </div>
    );
  }
});
