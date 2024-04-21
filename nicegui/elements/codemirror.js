export default {
  template: `
    <div></div>
  `,
  props: {
    value: String,
    language: String,
    theme: String,
    resource_path: String,
    lineWrapping: Boolean,
    minHeight: String,
    fixedHeight: String,
    maxHeight: String,
  },
  watch: {
    value(new_value) {
      this.set_editor_value(new_value);
    },
    language(new_language) {
      this.set_language(new_language);
    },
    theme(new_theme) {
      this.set_theme(new_theme);
    },
  },
  methods: {
    find_language(name) {
      for (const language of this.languages)
        for (const alias of [language.name, ...language.alias])
          if (name.toLowerCase() === alias.toLowerCase()) return language;

      console.error(`Language not found: ${this.language}`);
      console.info("Supported languages names:", languages.map((lang) => lang.name).join(", "));
      return null;
    },
    get_languages() {
      // Over 100 supported languages: https://github.com/codemirror/language-data/blob/main/src/language-data.ts
      return this.languages.map((lang) => lang.name);
    },
    set_language(language) {
      const lang_description = this.find_language(language, this.languages);
      if (!lang_description) {
        console.error("Language not found:", language);
        return;
      }

      lang_description.load().then((extension) => {
        this.editor.dispatch({
          effects: this.languageConfig.reconfigure([extension]),
        });
      });
    },
    get_themes() {
      // `this.themes` also contains some non-theme objects
      // The real themes are Arrays
      return Object.keys(this.themes).filter((key) => Array.isArray(this.themes[key]));
    },
    set_theme(theme) {
      const new_theme = this.themes[theme];
      if (!new_theme) {
        console.error("Theme not found:", theme);
        return;
      }
      this.editor.dispatch({
        effects: this.themeConfig.reconfigure([new_theme]),
      });
    },
    set_editor_value(value) {
      if (this.editor && this.editor.state.doc.toString() !== value)
        this.editor.dispatch({ changes: { from: 0, to: this.editor.state.doc.length, insert: value } });
    },
  },
  async mounted() {
    const { EditorView, basicSetup, keymap, indentWithTab, languages, themes, Compartment } = await import(
      `${this.resource_path}/editor.js`
    );

    const changeListener = EditorView.updateListener.of((update) => {
      if (!update.docChanged) return;
      const value = update.state.doc.toString();
      this.$emit("update:value", value);
    });

    // The Compartments are used to change the theme and language dynamically
    this.themes = themes;
    this.themeConfig = new Compartment();
    this.languages = languages;
    this.languageConfig = new Compartment();

    const extensions = [
      basicSetup,
      keymap.of([indentWithTab]),
      changeListener,
      this.themeConfig.of([]),
      this.languageConfig.of([]),
    ];

    const addToTheme = (content) => {
      extensions.push(EditorView.theme(content));
    };

    // Setting the height is a little tricky from the outside.
    // These theme adjustments come from https://codemirror.net/examples/styling/
    if (this.fixedHeight) {
      addToTheme({
        "&": { height: "300px" },
        ".cm-scroller": { overflow: "auto" },
      });
    } else {
      if (this.maxHeight)
        addToTheme({
          "&": { "max-height": this.maxHeight },
          ".cm-scroller": { overflow: "auto" },
        });
      if (this.minHeight)
        addToTheme({
          ".cm-content, .cm-gutter": { minHeight: this.minHeight },
        });
    }

    if (this.lineWrapping) extensions.push(EditorView.lineWrapping);

    this.editor = new EditorView({
      doc: this.value,
      extensions: extensions,
      parent: this.$el,
    });

    this.set_language(this.language);
    this.set_theme(this.theme);
  },
};
