# G-Lax (Relax with Gulp)

### Introdution:
You know about Gulp ? The module bundler for patterns and technicals [[more information]](https://gulpjs.com/)
You're using Webpack / Rollup ... to create a Frontend static module bundler system, That's the best choice. But have you wondered what happend going when you make it with Gulp ? hmmm ... Why not ?

So today, we'll relax with gulp to see how Gulp work as a bundler for (Nunjuck, Sass, Javascript, Vue). Let's go !!!

#### Step 1
You need pull the project GLax from [[gitlab]]()

#### Step 2
Go to ==glax== folder run ==npm install==

#### Step 3
Open your coding editor, at terminal panel, try typing ==npm run dev:temp== wait a moment, and then you'll see finish message with lightgreen color
- Click to ==http://localhost:xxx== to open product webpage in local
- Click to ==http://x.x.x.x:xxx== to open product webpage in external local, and you can use this address id to open in your smartphone browser
<br>

![alt](./image/gulp-step-3.jpg)

<u>NOTE</u>
Beside the ==npm run dev:temp== syntax, often use to build project in dev enviroment (with template Nunjuck), You can use another syntax to build project just in dev but without template (Only css and js) or production enviroment.

- ==npm run dev== - build project in dev enviroment without template.
- ==npm run prod== - build project in production enviroment.

And...Finish ! Just a few step, you can see the total view of how G-Lax project bundler work. But if you want to create project of yourself with <span style="display:inline-block">G-Lax</span>, then you can readmore about the structure static folders and files below.

### Nunjuck structure (you can refer to demo of home-page template) [[Nunjuck]](https://mozilla.github.io/nunjucks/)

src
|__ njk
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|__ ==_layout.njk== (A standard form to render HTML)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|__ ==_demo.nj== (A Demo file will teach you how to create template with nunjuck at basic)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|__ ==template== (A folder that include files used to create special layouts)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|__ ==partial== (A folder that include files used to create special sections for each template)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|__ ==component== (A folder that include files used to create global component for each template / section)

### Sass structure (you can refer to demo of home-page partial) [[Sass]](https://sass-lang.com/)

src
|__ scss
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|__ ==vendor.scss== (A file that include ==_base.scss== and global style)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|__ ==_var.scss== (A file that include general variables for style)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|__ ==_base.scss== (A file that include all of basic style)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|__ ==var== (A folder that include special variable files)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|__ ==partial== (A folder that include special style files used to create global component for each template / section)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|__ ==mixin== (A folder that include [mixin](https://sass-lang.com/documentation/at-rules/mixin) files of sass)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|__ ==function== (A folder that include [function](https://sass-lang.com/documentation/at-rules/function) files of sass)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|__ ==lib== (A folder that include lib files of the third party)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|__ ==layout== (A folder that include files that setup basic style for layout)

### Javascript structure (you can refer to demo of home-page partial) [[Javascript]](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

src
|__ js
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|__ ==vendor.js== (A file that include all of original init for running javascript of project)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|__ ==partial== (A folder that include javascript and vue files for each special template)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|__ ==lib== (A folder that include javascript files of third party)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|__ ==base== (A folder that include javascript files, which used to define common information)

### DummyData structure

src
|__ js
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|__ ==data-store== (A folder that include all of dummy data files, which used to define dummy data quicky for render process)

---

<u>NOTE</u>
All of structure above are based a few Design System, Design Pattern that you can refer to
- [Nunjuck design layout pattern](https://css-tricks.com/component-led-design-patterns-nunjucks-grunt/?fbclid=IwAR2DQUKbQU73EKzF7fTigl0QPwwtUTaFLUGhW2VLy3IXmazEGZ--dQ-yJE8)
- [Design System for style structure](https://uifreebies.net/blog/12-design-systems-you-must-know)
