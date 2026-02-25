document.addEventListener('DOMContentLoaded', function(){
    class LipsumApp{
        constructor(config){
            // range slider config
            this.rangeConfig = {
                'word': {min: 1, max: 99},
                'sentence': {min: 1, max: 15},
                'paragraph': {min: 1, max: 10},
                'list': {min: 1, max: 10},
            };

            // options (to save to storage)
            this.options = {
                ...{
                    dev: false,
                    type: 'word',
                    rangeQuantity: {
                        'word': 5, 'sentence': 3, 'paragraph': 2, 'list': 3,
                    },
                    hasPrefix: false,
                    isAutoCopy: false,
                    textTransform: 'capitalizeFirstWordInSentence',
                    onChange: () => {
                    },
                    onOptionsUpdate: () => {
                    },
                    onAfterInit: () => {
                    }
                }, ...config
            };

            this.value = '';
            this.range = document.querySelector('input[data-quantity]');
            this.buttonCopySlug = document.querySelector('[data-copy-slug]');
            this.buttonCopyText = document.querySelector('[data-copy-text]');
            this.outputLength = document.querySelector('[data-output-length]');
            this.output = document.querySelector('[data-output]');
            this.outputWrapper = document.querySelector('.output-wrapper');

            // controllers
            this.control = {
                quantity: rangeSlider(this.range, {
                    hasArrows: true, onChange: data => {
                        this.options.rangeQuantity[this.options.type] = data.val;

                        this.triggerOptionsUpdateEvent();
                        this.updateRangeSlider(data.val);
                        this.generate();
                    }
                }), type: buttonGroupEffect(document.querySelector('.btn-group.is-indicator'), {
                    onChange: data => {
                        this.options.type = data.type;

                        this.triggerOptionsUpdateEvent();
                        this.updateRangeSlider();
                        this.generate();
                    }
                }), checkboxes: checkboxes(document.querySelectorAll('[data-checkbox]'), {
                    onChange: data => {
                        switch(data.checkbox){
                            case 'prefix':
                                this.options.hasPrefix = data.isChecked;
                                this.generate();
                                break;
                            case 'auto-copy':
                                this.options.isAutoCopy = data.isChecked;
                                break;
                        }

                        this.triggerOptionsUpdateEvent();
                    }
                }),
                textTransform: dropdownControl(document.querySelector('[data-text-transform]'), {
                    onChange: data => {
                        this.options.textTransform = data;

                        this.triggerOptionsUpdateEvent();
                        this.generate();
                    }
                })
            };

            // init
            this.init();
        }

        init(){
            if(this.options.dev) console.log('init', this.options);

            // button > copy text
            this.buttonCopyText.addEventListener('click', () => {
                copyValueToClipboard(this.output.innerHTML);
                const text = `Copied ${app.control.quantity.val()} ${app.control.type.getType() === 'list' ? 'list item' : app.control.type.getType()}${app.control.quantity.val() > 1 ? 's' : ''} 🧡`;
                this.showToast(text);
            });

            // button > copy slug (type:word)
            this.buttonCopySlug.addEventListener('click', () => {
                copyValueToClipboard(stringToSlug(this.output.innerHTML));
                this.showToast('Slug copied 🧡');
            });


            // update range slider
            this.updateRangeSlider();

            // update type
            this.control.type.set(this.options.type);

            // update checkbox prefix (no trigger generate)
            this.control.checkboxes.set('prefix', this.options.hasPrefix, false);
            this.control.checkboxes.set('auto-copy', this.options.isAutoCopy, false);

            // update text transform (also generate)
            this.control.textTransform.set(this.options.textTransform);

            // event > after init
            this.options.onAfterInit(this.options);
        }

        updateRangeSlider(number = this.options.rangeQuantity[this.options.type]){
            if(this.options.dev) console.log('updateRangeSlider', number);

            // update range slider
            if(this.rangeConfig[this.options.type]){
                this.range.setAttribute('min', this.rangeConfig[this.options.type].min);
                this.range.setAttribute('max', this.rangeConfig[this.options.type].max);
                this.control.quantity.updateLabels();
            }

            // update quantity
            this.control.quantity.set(number, false);
        }

        generate(){
            this.value = Lipsum.get({
                ...this.options,
                quantity: this.options.rangeQuantity[this.options.type]
            });

            // set output
            this.output.innerHTML = this.value;

            // update length
            this.outputLength.textContent = this.value.length;

            // event > onChange
            this.options.onChange(this.options);

            if(this.options.dev) console.log('generated', this.options);
        }

        showToast(text){
            toast({text: text, wrapper: this.outputWrapper});
        }

        triggerOptionsUpdateEvent(){
            // update copy buttons
            if(this.options.type === 'word'){
                this.buttonCopySlug.classList.remove('disabled');
            }else{
                this.buttonCopySlug.classList.add('disabled');
            }

            this.options.onOptionsUpdate(this.options);
        }
    }

    // detect
    const isExtension = typeof chrome !== 'undefined' && typeof chrome.storage !== 'undefined';
    document.body.classList.add(isExtension ? 'is-extension' : 'is-web');

    // load settings from storage
    const browserStorage = new MyStorage('lipsum-generator');

    // init app
    const app = new LipsumApp({
        ...browserStorage.get(), dev: false,
        onOptionsUpdate: data => {
            browserStorage.set(data);
        },
        onAfterInit: data => {
            setTimeout(() => {
                document.querySelector('.app-body.loading').classList.remove('loading');

                if(isExtension && data.isAutoCopy){
                    document.querySelector('[data-copy-text]').click();
                }
            }, 300);
        }
    });
});