var data =[
			{ 
				name:"父节点1 - 展开", 
				open:true,
				children: [
					{ 
						name:"父节点11 - 折叠",
						children: [
							{ 
								name:"叶子节点111",
								children: [
									{name: 1},
									{name: 2},
									{
										name: 3,
										children:[
											{
												name: 11
											},
											{
												name: 12,
												children: [
													{
														name: 'a'
													},
													{
														name: 'b',
														children: [
															{
																name: 'hello'
															},
															{
																name: 'world',
																children: [
																	{
																		name: '我是最后一层不写了'
																	}
																]
															}
														]
													}
												]
											}
										]
									}
								]
							},
							{ name:"叶子节点112"},
							{ name:"叶子节点113"},
							{ name:"叶子节点114"}
						]
					},
					{ 
						name:"父节点12 - 折叠",
						children: [
							{ name:"叶子节点121"},
							{ name:"叶子节点122"},
							{ name:"叶子节点123"},
							{ name:"叶子节点124"}
						]
					},
					{ 
						name:"父节点13 - 没有子节点", 
						isParent:true}
				]
			},
			{ 
				name:"父节点2 - 折叠",
				children: [
					{ name:"父节点21 - 展开", open:true,
						children: [
							{ name:"叶子节点211"},
							{ name:"叶子节点212"},
							{ name:"叶子节点213"},
							{ name:"叶子节点214"}
						]},
					{ name:"父节点22 - 折叠",
						children: [
							{ name:"叶子节点221"},
							{ name:"叶子节点222"},
							{ name:"叶子节点223"},
							{ name:"叶子节点224"}
						]},
					{ name:"父节点23 - 折叠",
						children: [
							{ name:"叶子节点231"},
							{ name:"叶子节点232"},
							{ name:"叶子节点233"},
							{ name:"叶子节点234"}
						]}
				]},
			{ name:"父节点3 - 没有子节点", isParent:true}
		];

		var tree = function(w, d){
			if(!document.createElement('div').insertAdjacentElement){
				HTMLElement.prototype.insertAdjacentElement = function(where, node){
			        switch (where) {  
			            case "beforebegin":  
			                this.parentNode.insertBefore(node, this);break;  
			            case "afterbegin":  
			                this.insertBefore(node, this.firstChild);break;  
			            case "beforeend":  
			                this.appendChild(node);break;  
			            case "afterend":  
			                if (this.nextSibling) this.parentNode.insertBefore(node, this.nextSibling); 
			                else this.parentNode.appendChild(node);  
			                break;  
			        };  
			    };
			}
			function T(o, data, option){
				this.o = typeof o=='object'? o:d.querySelector(o);
				this.option = {
					className: 'tree-list',
					openClass: 'tree-list-open'
				}
				this.extend(this.option, option||{});
				this.init(this.o, data, this.option);
			}
			T.prototype = {
				constructor: T,
				setView: function(data){
					for(var i=0,len=data.length;i<len;i++){
						var oLi = d.createElement('li');
						oLi.innerHTML = data[i].name;
						this.o.appendChild(oLi);
						if(data[i].children){
							if(data[i].open){
								this.addClass(oLi, this.option.className+' '+this.option.openClass);
							}else{
								this.addClass(oLi, this.option.className);
							}
							this.hasChild(oLi, data[i].children);
						}						
					}
				},
				hasChild: function(dom, data){
					var oUl = d.createElement('ul');
					dom.insertAdjacentElement('afterend', oUl);
					for(var i=0,len=data.length;i<len;i++){
						var oLi = d.createElement('li');
						oLi.innerHTML = data[i].name;
						oUl.insertAdjacentElement('beforeend', oLi);
						if(data[i].children){
							if(data[i].open){
								this.addClass(oLi, this.option.className+' '+this.option.openClass);
							}else{
								this.addClass(oLi, this.option.className);
							}
							this.hasChild(oLi, data[i].children);
						}						
					}
				},
		    	hasClass: function(o, s){
				    return new RegExp('\\b'+s+'\\b').test(o.className);
				},
				addClass: function(o, s){
				    if(!this.hasClass(o, s)) s:o.className+=' '+s;
				},
				removeClass: function(o, s){
				    if(this.hasClass(o, s)) o.className=o.className.replace(new RegExp('(?:^|\\s)'+s+'(?=\\s|$)'), '').replace(/^\s*|\s*$/g, '');
				},
				toggleClass: function(o, s){
					if(this.hasClass(o, s))	this.removeClass(o, s);
					else this.addClass(o, s);
				},
				addEvent: function(o, t, h){
		            if(o.addEventListener){
		                this.addEvent = function(o, t, h){
		                    o.addEventListener(t, h, false);
		                    return h;
		                }
		            }else{
		                this.addEvent = function(o, t, h){
		                    var _h = h;
		                    h = function(e){
		                        var e = e||window.event;
		                        _h.call(o, e);
		                    }
		                    o.attachEvent('on'+t, h);
		                    return h;
		                }
		            }
		            return this.addEvent(o, t, h);
		        },
		        removeEvent: function(o, t, n){
		            if(o.removeEventListener){
		                this.removeEvent = function(o, t, n){
		                    o.removeEventListener(t, n, false);
		                }
		            }else{
		                this.removeEvent = function(o, t, n){
		                    o.detachEvent('on'+t, n);
		                }
		            }
		            this.removeEvent(o, t, n);
		        },
		        delegate: function(o, ta, t, h){
				    return fn = this.addEvent(o, t, function(e){
				        var _this = e.target||e.srcElement;
				        if(ta.charAt(ta)==='.'){
				            var reg = new RegExp('\\b'+ta.substr(1)+'\\b');
				            while(_this!=o){
				                if(reg.test(_this.className)){
				                    h.apply(_this, arguments);
				                    break ;
				                }
				                _this = _this.parentNode;
				            }
				        }else{
				            while(_this!=o){
				                if(_this.tagName.toLowerCase()===ta){
				                     h.apply(_this, arguments);
				                     break;
				                 }
				              _this = _this.parentNode;
				            }
				        }
				        // 阻止事件冒泡
				        e.stopPropagation? e.stopPropagation():e.cancelBubble=true;
				        // 阻止默认事件
				        e.preventDefault? e.preventDefault():e.returnValue=false; 
				    });
		        },
				extend: function(o1, o2){
					for(var i in o2) o1[i] = o2[i];					
				},
				init: function(o, data, option){
					var self = this;
					this.setView(data);
					this.delegate(this.o, '.'+option.className, 'click', function(){
						self.toggleClass(this, option.openClass);
					});
				}
			};
			return function(o, data, option){
				return new T(o, data, option);
			}
		}(window, document);
		tree('#tree', data, {});