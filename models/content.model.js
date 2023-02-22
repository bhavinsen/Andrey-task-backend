module.exports = (sequelize, Sequelize) => {
    const Content = sequelize.define("content", {
     
      content: {
        type: Sequelize.STRING
      },
    
    });
  
    return Content;
  };