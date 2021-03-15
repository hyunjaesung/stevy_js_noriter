const execSync = require('child_process').execSync;
const inquirer = require('inquirer');

const choiceSep = new inquirer.Separator();

const jobs = {
  type: 'list',
  name: 'job',
  message: '실행할 작업을 선택하세요.',
  default: 'webpack-p',
  choices: [
    {
        name: ' 🎃 Giphy로 SPA 만들기 ',
        value: 'custom-spa-giphy-start',
        short: '\nGiphy로 SPA 만들기',
    },
    {
        name: ' 💀 코드스피츠 OOP MVVM 연습 ',
        value: 'oop-js-mvvm',
        short: '\n코드스피츠 OOP MVVM 연습',
    },
    {
        name: ' 🦋 커스텀 리액트 연습',
        value: 'custom-react',
        short: '\n커스텀 리액트 연습',
    },
    {
      name: ' 🐉 함수형 프로그래밍 연습',
      value: 'functional-js',
      short: '\n함수형 프로그래밍 연습',
    },
    choiceSep,
    { name: '😢  종료', value: 'exit', short: '\n' },
    choiceSep,
  ],
};
const stdioOption = { stdio: [0, 1, 2], maxBuffer: 1024 * 500 };

process.on('exit', () => console.log('\n안녕히 가세요. 다시 만나요. 👋'));


inquirer.prompt([jobs]).then(({ job }) => {

  if (job === 'exit') {
    process.exit();
  } else if (job) {
    execSync(`npm run ${job}`, stdioOption);
  }
});
