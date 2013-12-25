var SoftFloat = (function(){
    console.log('Hello World');
    function SoftFloat() {

        this.value = this.source = this.target = 0;
        this.targeting = false;
        this.enabled = true;

        this.ATTRACTION = 0.0000000001;
        this.DAMPING = 0.000005;

        this.value = 0;
        this.velocity = 0;
        this.acceleration = 0;

        this.targeting = false;
        this.source = 0;
        this.target = 0;
        this.enableAnimation = true; 

        this.set = function(v) {
            this.value = v;
            this.targeting = true;
        }

        this.get = function() {
            return this.value;
        }

        this.getInt = function() {
            return parseInt(this.value);
        }

        this.enable = function() {
            this.enabled = true;
        }

        this.disable = function() {
            this.enabled = false;
        }

        this.update = function() {
            if (!this.enabled){
                return false;
            }
            if (this.targeting) {
                if(!this.enableAnimation){
                    this.value = this.target;
                    this.targeting = false;
                } else {
                    this.acceleration += (this.ATTRACTION * (this.target - this.value));
                    this.acceleration += (this.target - this.value);
                    this.velocity = (this.velocity + this.acceleration) * this.DAMPING;
                    this.value += this.velocity;           
                    if (Math.abs(this.velocity) > 0.0001) {
                        return true;
                    }
                    this.value = this.target;
                    this.targeting = false;
                }
            }
            return false;
        }

        this.setTarget = function(t) {
            this.targeting = true;
            this.target = t;
            this.source = this.value;
        }

        this.getTarget = function() {
            return this.targeting ? this.target : this.value;
        }
    }
    return SoftFloat; 
})();