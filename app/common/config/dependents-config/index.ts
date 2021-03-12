interface ArrDependentsItemConfigConstruct {
  parserSteps: Array<any>,
  prefixes: Array<string>,
  postfixes: Array<string>,
  basePaths: Array<string>,
};

interface ArrDependentsConfigConstruct {
  [key:string]: ArrDependentsItemConfigConstruct
};

const arrDependentsConfig: ArrDependentsConfigConstruct = {
  ".scss": {
      parserSteps: [
          /^\s*@import\s+(.+?);/gm,
          function (text) { return text.split(","); },
          /"([^"]+)"|'([^']+)'/m
      ],
      prefixes: ['_'],
      postfixes: ['.scss','.sass'],
      basePaths: [],
  },
};

export default arrDependentsConfig
