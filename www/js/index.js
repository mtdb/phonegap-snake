/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * 'License'); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        if (id == 'deviceready') {
            var move;
            app.snake();

            navigator.accelerometer.watchAcceleration(function(acceleration) {
                if (Math.abs(acceleration.y) > Math.abs(acceleration.z))
                    move = acceleration.y > 0 ? 'snake/up' : 'snake/down';
                else
                    move = acceleration.x > 0 ? 'snake/right' : 'snake/left';

                $(document).trigger(move);
            }, function() {
                alert('onError!');
            }, {frequency: 300});
        }
    },
    snake: function(){
        /*
         * http://thecodeplayer.com/walkthrough/
         * html5-game-tutorial-make-a-snake-game-using-html5-canvas-jquery
         */

        var canvas = $('#canvas')[0],
            ctx = canvas.getContext('2d'),
            w = $('#canvas').width(),
            h = $('#canvas').height(),
            cw = 10,
            d,
            food,
            score,
            snake_array;
        
        function init() {
            d = 'right';
            create_snake();
            create_food();
            score = 0;
            if(typeof game_loop != 'undefined') clearInterval(game_loop);
            game_loop = setInterval(paint, 60);
        }
        init();
        
        function create_snake() {
            var length = 5;
            snake_array = [];
            for(var i = length-1; i>=0; i--) {
                snake_array.push({x: i, y:0});
            }
        }
        
        function create_food() {
            food = {
                x: Math.round(Math.random()*(w-cw)/cw), 
                y: Math.round(Math.random()*(h-cw)/cw), 
            };
        }
        
        function paint() {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, w, h);
            ctx.strokeStyle = 'black';
            ctx.strokeRect(0, 0, w, h);
            
            var nx = snake_array[0].x;
            var ny = snake_array[0].y;

            if(d == 'right') nx++;
            else if(d == 'left') nx--;
            else if(d == 'up') ny--;
            else if(d == 'down') ny++;
            
            if(nx == -1 || nx == w/cw || ny == -1 ||
                ny == h/cw || check_collision(nx, ny, snake_array)) {
                //restart game
                init();
                return;
            }
            
            if(nx == food.x && ny == food.y) {
                var tail = {x: nx, y: ny};
                score++;
                create_food();
            }
            else {
                var tail = snake_array.pop();
                tail.x = nx; tail.y = ny;
            }
            
            snake_array.unshift(tail);
            
            for(var i = 0; i < snake_array.length; i++) {
                var c = snake_array[i];
                paint_cell(c.x, c.y);
            }
            
            paint_cell(food.x, food.y);
            var score_text = 'Score: ' + score;
            ctx.fillText(score_text, 5, h-5);
        }
        
        function paint_cell(x, y) {
            ctx.fillStyle = 'blue';
            ctx.fillRect(x*cw, y*cw, cw, cw);
            ctx.strokeStyle = 'white';
            ctx.strokeRect(x*cw, y*cw, cw, cw);
        }
        
        function check_collision(x, y, array) {
            for(var i = 0; i < array.length; i++) {
                if(array[i].x == x && array[i].y == y)
                    return true;
            }
            return false;
        }
        
        $(document).on('snake/down', function() {
            if (d != 'up')
                d = 'down';
        });
        $(document).on('snake/up', function() {
            if (d != 'down')
                d = 'up';
        });
        $(document).on('snake/right', function() {
            if (d != 'left')
                d = 'right';
        });
        $(document).on('snake/left', function() {
            if (d != 'right')
                d = 'left';
        });
    }
};
