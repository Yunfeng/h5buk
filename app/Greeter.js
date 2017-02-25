import styles from './Greeter.css';
import config from './config.json';

module.exports = function() {
  var greet = document.createElement('div');
  greet.textContent = config.greetText;
  // console.log(styles);
  // console.log(styles.root);
  greet.setAttribute("class", styles.root);
  return greet;
};