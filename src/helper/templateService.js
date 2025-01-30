const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');


const renderTemplate = async (templateName, data) => {
    try {
        const filePath = path.join(__dirname, '../templates', `${templateName}.hbs`);
        const templateSourse = await fs.readFile(filePath, 'utf8');
        const template = handlebars.compile(templateSourse);
        return template(data);
    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    renderTemplate,
}