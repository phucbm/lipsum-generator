jQuery(function($){
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
                        'word': 5,
                        'sentence': 3,
                        'paragraph': 2,
                        'list': 3,
                    },
                    onChange: () => {
                    }
                }, ...config
            };

            this.value = '';
            this.range = $('input[data-quantity]');
            this.buttonCopySlug = $('[data-copy-slug]');
            this.buttonCopyText = $('[data-copy-text]');
            this.outputLength = $('[data-output-length]');
            this.output = $('[data-output]');
            this.outputWrapper = $('.output-wrapper');

            // controllers
            this.control = {
                quantity: this.range.rangeSlider({
                    hasArrows: true, onChange: data => {
                        this.options.rangeQuantity[this.options.type] = data.val;

                        this.updateRangeSlider(data.val);
                        this.generate();
                    }
                }),
                type: $('.btn-group.is-indicator').buttonGroupEffect({
                    onChange: data => {
                        this.options.type = data.type;

                        // update copy button
                        if(this.options.type === 'word'){
                            this.buttonCopySlug.removeClass('disabled');
                        }else{
                            this.buttonCopySlug.addClass('disabled');
                        }

                        this.updateRangeSlider();
                        this.generate();
                    }
                }),
                checkboxes: $('[data-checkbox]').checkboxes({
                    onChange: data => {
                        if(data.checkbox === 'prefix'){
                            this.generate();
                        }
                    }
                }),
                textTransform: $('[data-text-transform]').dropdownControl({
                    onChange: () => this.generate()
                })
            };

            // init
            this.init();
        }

        init(){
            if(this.options.dev) console.log('init', this.options);

            // button > copy text
            this.buttonCopyText.on('click', () => {
                copyValueToClipboard(this.output.html());
                const text = `Copied ${app.control.quantity.val()} ${app.control.type.getType() === 'list' ? 'list item' : app.control.type.getType()}${app.control.quantity.val() > 1 ? 's' : ''} 🧡`;
                this.toast(text);
            });

            // button > copy slug (type:word)
            this.buttonCopySlug.on('click', () => {
                copyValueToClipboard(stringToSlug(this.output.html()));
                this.toast('Slug copied 🧡');
            });


            // update range slider
            this.updateRangeSlider();

            // update type
            this.control.type.set(this.options.type);

            // first run
            this.generate();
        }

        updateRangeSlider(number = this.options.rangeQuantity[this.options.type]){
            if(this.options.dev) console.log('updateRangeSlider', number);

            // update range slider
            if(this.rangeConfig[this.options.type]){
                this.range.attr('min', this.rangeConfig[this.options.type].min);
                this.range.attr('max', this.rangeConfig[this.options.type].max);
                this.control.quantity.updateLabels();
            }

            // update quantity
            this.control.quantity.set(number, false);
        }

        generate(){
            this.value = Lipsum.get(this.options);

            // set output
            this.output.html(this.value);

            // update length
            this.outputLength.text(this.value.length);

            // event > onChange
            this.options.onChange(this.options);

            if(this.options.dev) console.log('generated', this.options);
        }

        toast(text){
            $().toast({text: text, wrapper: this.outputWrapper});
        }
    }


    // init app
    const options = {
        dev: true,
        type: 'list',
        rangeQuantity: {
            'word': 1,
            'sentence': 2,
            'paragraph': 3,
            'list': 4,
        }
    };
    const app = new LipsumApp({
        ...options,
        onChange: data => {
            //console.log(data)
        }
    });
});