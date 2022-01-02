/**!
 * Lipsum Generator v3.0.0
 * https://github.com/phucbm/lipsum-generator
 * MIT License - Copyright (c) 2022 Minh-Phuc Bui
 */
;(function(Lipsum){
    class LipsumCore{
        constructor(config){
            this.types = ['word', 'sentence', 'paragraph'];
            this.defaultQuantity = {
                'word': 5,
                'sentence': 3,
                'paragraph': 2
            };
            this.typeRandomRange = {
                'word': {},
                'sentence': {from: 6, to: 12},
                'paragraph': {from: 4, to: 8}
            };

            this.options = {
                ...{
                    sourceString: 'lorem ipsum dolor sit amet consectetur adipiscing elit integer nec odio praesent libero sed cursus ante dapibus diam nisi nulla quis sem at nibh elementum imperdiet duis sagittis mauris fusce tellus augue semper porta massa vestibulum lacinia arcu eget class aptent taciti sociosqu ad litora torquent per conubia nostra inceptos himenaeos curabitur sodales ligula in dignissim nunc tortor pellentesque aenean quam scelerisque maecenas mattis convallis tristique proin ut vel egestas porttitor morbi lectus risus iaculis suscipit luctus non ac turpis aliquet metus ullamcorper tincidunt euismod quisque volutpat condimentum velit nam urna neque a facilisi fringilla suspendisse potenti feugiat mi consequat sapien etiam ultrices justo eu magna lacus vitae pharetra auctor interdum primis faucibus orci et posuere cubilia curae molestie dui blandit congue pede facilisis laoreet donec viverra malesuada enim est pulvinar sollicitudin cras id nisl felis venenatis commodo ultricies accumsan pretium fermentum nullam purus aliquam mollis vivamus consectetuer si leo eros maximus gravida erat letius ex hendrerit lobortis tempus rutrum efficitur phasellus natoque penatibus magnis dis parturient montes nascetur ridiculus mus vehicula bibendum vulputate dictum finibus eleifend rhoncus placerat tempor ornare hac habitasse platea dictumst habitant senectus netus fames',
                    prefixString: 'lorem ipsum dolor sit amet',
                    type: 'word', // default type
                    quantity: this.defaultQuantity[config.type]
                }, ...config
            };

            this.sourceArray = parseString(this.options.sourceString);
        }

        /**
         * Get array of word|sentence|paragraph
         * @param type
         * @param quantity
         * @returns {*}
         */
        getArray(type = this.options.type, quantity = this.options.quantity){
            if(!this.types.includes(type)){
                console.warn(`[${type}] is not supported!`);
                return;
            }

            const from = this.typeRandomRange[type].from;
            const to = this.typeRandomRange[type].to;
            const result = [];

            switch(type){
                case "word":
                    let word = '';
                    while(result.length < quantity){
                        word = this.sourceArray[random(0, this.sourceArray.length - 1)];
                        if(!result.includes(word)){
                            result.push(word);
                        }
                    }
                    break;
                case "sentence":
                    while(result.length < quantity){
                        result.push(this.getArray('word', random(from, to)));
                    }
                    break;
                case "paragraph":
                    while(result.length < quantity){
                        result.push(this.getArray('sentence', random(from, to)));
                    }
                    break;
            }

            return result;
        }


        /**
         * Get string from array of word|sentence|paragraph
         * @param type
         * @param quantity
         * @param array
         * @returns {string}
         */
        getString(type = this.options.type, quantity = this.options.quantity, array = []){
            array = array.length ? array : this.getArray(type, quantity);
            let result = '';

            switch(type){
                case "word":
                    for(const word of array) result += word + ' ';
                    break;
                case "sentence":
                    for(const words of array){
                        result += capitalizeFirstLetter(this.getString("word", quantity, words)) + '. ';
                    }
                    break;
                case "paragraph":
                    for(const sentences of array){
                        result += this.getString("sentence", quantity, sentences) + '\n\n';
                    }
                    break;
            }

            // remove the last white space
            result = result.trim();

            return result;
        }
    }


    /**
     * Get lipsum
     * @param config
     * @returns {string}
     */
    Lipsum.get = (config) => {
        const options = {
            ...{
                type: 'word',
                quantity: 5,
                hasPrefix: false
            }, ...config
        };

        const lipsum = new LipsumCore(options);
        console.log(options)

        return lipsum.getString();
    };

})(window.Lipsum = window.Lipsum || {});