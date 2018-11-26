!function(e,r){"use strict";var b=e.indexedDB||e.webkitIndexedDB||e.mozIndexedDB||e.oIndexedDB||e.msIndexedDB,p=e.IDBKeyRange||e.webkitIDBKeyRange;if(!b)throw"IndexedDB required";var t=function(r,t){var e=function(){var e=r.apply(this,arguments);return e.name=this.name=t,this.stack=e.stack,this.message=e.message,this};return e.prototype=Object.create(r.prototype,{constructor:{value:e}}),e},n=t(e.Error,"HustleError"),m=t(n,"HustleDBClosed"),h=t(n,"HustleDBOpened"),y=t(n,"HustleBadTube"),w=t(n,"HustleBadID"),g=t(t(e.Error,"HustleNotice"),"HustleNotFound"),o=function(a){a||(a={}),a.tubes||(a.tubes=[]);var n=a.db_version?a.db_version:1,r=a.maintenance_delay?a.maintenance_delay:1e3,o=a.db_name?a.db_name:"hustle",f={ids:"_ids",reserved:"_reserved",delayed:"_delayed",buried:"_buried"};a.tubes.indexOf("default")<0&&a.tubes.push("default");var s,v=null,d=function(){if(!v)throw new m("Closed database being operated on. Did you call Hustle.open()?");return!0},u=function(e,r,t){t||(t={});var o=null,n=e.target.result,s=t.keypath?t.keypath:"id",u=!!t.autoincrement&&t.autoincrement;if(o=n.objectStoreNames.contains(r)?e.currentTarget.transaction.objectStore(r):n.createObjectStore(r,{keyPath:s,autoIncrement:u}),t.indexes)for(var i=Object.keys(t.indexes),c=0;c<i.length;c++)!function(e,r){var t=r.index?r.index:e,n=!!r.unique;try{o.createIndex(e,t,{unique:n})}catch(e){}}(i[c],t.indexes[i[c]]);return o},e=function(){return!!v&&(v.close(),!(v=null))},i=function(s,u,i,c){c||(c={});var a=v.transaction([u,i],"readwrite");a.oncomplete=function(e){c.success&&c.success(e)},a.onerror=function(e){c.error&&c.error(e)};var d,l=a.objectStore(u);if(u==f.buried){var e=l.index("id");d=e.get(s)}else d=l.get(s);d.onsuccess=function(e){var r=d.result;if(r){var t,n,o=r.id;u==f.buried&&(o=r._id),t=r,n=function(e){l.delete(o).onerror=c.error},c.transform&&(t=c.transform(t)),a.objectStore(i).add(t).onsuccess=n}else c.error&&c.error(new g("item "+s+" wasn't found"))}},c=function(r,t){if(d(),t||(t={}),!r)return t.error&&t.error(new HustleBadId("bad id given")),!1;var n=null,e=[f.reserved,f.delayed,f.buried].concat(a.tubes),o=v.transaction(e,"readonly");o.oncomplete=function(e){n||!t.not_found_error?t.success&&t.success(n,e):t.error&&t.error(new g("item "+r+" not found"))},o.onerror=function(e){t.error&&t.error(e)},e.forEach(function(t){var e;t==f.buried?e=o.objectStore(t).index("id").get(r):e=o.objectStore(t).get(r);e.onsuccess=function(e){var r=e&&e.target&&e.target.result;if(n||!r)return!1;(n=r).age=Math.round(((new Date).getTime()-n.expire)/1e3),t==f.reserved?(n.state="reserved",0<n.ttr&&(n.time_left=Math.round((n.expire-(new Date).getTime())/1e3))):t==f.buried?n.state="buried":(n.state="ready",n.tube||(n.tube=t))}})},l=function(o){d(),o||(o={});var s=o.tube?o.tube:"default";if(a.tubes.indexOf(s)<0)throw new y("tube "+s+" doesn't exist");var u=null,i=v.transaction([f.reserved,s],"readwrite");i.oncomplete=function(e){o.success&&o.success(u,e)},i.onerror=function(e){o.error&&o.error(e)};var c=i.objectStore(s);c.index("priority").openCursor().onsuccess=function(e){var r,t,n=e.target.result;n&&(r=n.value,t=function(e){c.delete(n.value.id).onerror=o.error},(u=r).reserves++,u.tube=s,0<u.ttr&&(u.expire=(new Date).getTime()+1e3*u.ttr),i.objectStore(f.reserved).add(u).onsuccess=t)}};s=function(){var e=function(){if(!v)return!1;!function(r){r||(r={});var t=[],e=v.transaction(f.delayed,"readonly");e.oncomplete=function(e){t.forEach(function(e){i(e.id,f.delayed,e.tube,{error:function(e){console.error("Hustle: delayed move: ",e)}})})},e.onerror=function(e){console.error("Hustle: delayed move: ",e),r.error&&r.error(e)};var n=e.objectStore(f.delayed).index("activate"),o=(new Date).getTime(),s=p.upperBound(o);n.openCursor(s).onsuccess=function(e){var r=e.target.result;r&&(t.push(r.value),r.continue())}}(),function(r){r||(r={});var t=[],e=v.transaction(f.reserved,"readonly");e.oncomplete=function(e){t.forEach(function(r){i(r.id,f.reserved,r.tube,{transform:function(e){return delete e.expire,e.timeouts++,e},error:function(e){e instanceof g&&t.erase(r),console.error("Hustle: ttr move: ",e)}})})},e.onerror=function(e){console.error("Hustle: ttr move: ",e),r.error&&r.error(e)};var n=e.objectStore(f.reserved).index("expire"),o=(new Date).getTime(),s=p.upperBound(o);n.openCursor(s).onsuccess=function(e){var r=e.target.result;r&&(t.push(r.value),r.continue())}}(),setTimeout(e,r)};setTimeout(e,r)};var t={peek:c,put:function(e,t){if(d(),t||(t={}),!e)return!1;var n=t.tube?t.tube:"default";if(a.tubes.indexOf(n)<0)throw new y("tube "+n+" doesn't exist");var o=function(e,r){for(var t={data:e},n=[{name:"priority",type:"int",default:1024},{name:"delay",type:"int",default:0},{name:"ttr",type:"int",default:0}],o=0;o<n.length;o++){var s=n[o];if(r[s.name])switch(t[s.name]=r[s.name],s.type){case"int":t[s.name]=parseInt(t[s.name]);break;case"float":t[s.name]=parseFloat(t[s.name])}s.default&&void 0===t[s.name]&&(t[s.name]=s.default)}return t.age=0,t.reserves=0,t.releases=0,t.timeouts=0,t.buries=0,t.kicks=0,t.created=(new Date).getTime(),t}(e,t);o.delay&&0<o.delay&&(o.tube=n,o.activate=(new Date).getTime()+1e3*o.delay,n=f.delayed,delete o.delayed),function(r){d(),r||(r={});var t=null,e=v.transaction([f.ids],"readwrite");e.oncomplete=function(e){t?r.success&&r.success(t,e):r.error&&r.error("bad id")},e.onerror=function(e){r.error&&r.error(e)};var n=e.objectStore(f.ids),o=n.get("id");o.onsuccess=function(e){var r=o.result;r?(r.value++,t=r.value,n.put(r)):(t=1,n.put({id:"id",value:1}))}}({success:function(e){o.id=e;var r=v.transaction([n],"readwrite");r.oncomplete=function(e){t.success&&t.success(o,e)},r.onerror=function(e){t.error&&t.error(e)},r.objectStore(n).add(o).onsuccess=function(e){o.id=e.target.result}},error:function(e){t.error&&t.error(new w("error generating id"))}})},reserve:l,delete:function(e,o){d(),o||(o={}),c(e,{success:function(r){if(r){var e=r.tube,t=r.id;"reserved"==r.state?e=f.reserved:"buried"==r.state&&(e=f.buried,t=r._id);var n=v.transaction(e,"readwrite");n.oncomplete=function(e){o.success&&o.success(r,e)},n.onerror=function(e){o.error&&o.error(e)},n.objectStore(e).delete(t)}else o.success&&o.success(null)},error:o.error})},release:function(n,o){d(),o||(o={}),c(n,{not_found_error:!0,success:function(e){if("reserved"==e.state){var r=e.tube;if(o.delay){var t=parseInt(o.delay);t&&(e.activate=(new Date).getTime()+1e3*t,r=f.delayed)}i(n,f.reserved,r,{transform:function(e){if(e.releases++,o.priority){var r=parseInt(o.priority);r&&(e.priority=r)}return delete e.tube,e},success:o.success,error:o.error})}else o.error&&o.error(new g("item "+n+" isn't reserved"))},error:o.error})},bury:function(r,n){d(),n||(n={}),c(r,{not_found_error:!0,success:function(t){if("buried"!=t.state){var e=t.tube;"reserved"==t.state&&(e=f.reserved),i(r,e,f.buried,{transform:function(e){if(e.buries++,e.tube=t.tube,n.priority){var r=parseInt(n.priority);r&&(e.priority=r)}return e},success:n.success,error:n.error})}else n.success&&n.success()},error:n.error})},kick:function(t,n){d(),n||(n={});var o=0,e=[f.buried].concat(a.tubes),s=v.transaction(e,"readwrite");s.oncomplete=function(e){n.success&&n.success(o,e)},s.onerror=function(e){n.error&&n.error(e)};var u=s.objectStore(f.buried);u.openCursor().onsuccess=function(e){var r=e.target.result;r&&(function(e,r){e.kicks++;var t=e.tube;delete e._id,delete e.tube,s.objectStore(t).add(e).onsuccess=r}(r.value,function(e){u.delete(r.key).onerror=n.error}),++o<t&&r.continue())}},kick_job:function(r,t){d(),t||(t={}),c(r,{not_found_error:!0,success:function(e){"buried"==e.state?i(r,f.buried,e.tube,{transform:function(e){return e.kicks++,delete e._id,delete e.tube,e},success:t.success,error:t.error}):t.error&&t.error(new g("item "+r+" isn't buried"))},error:t.error})},touch:function(o,s){d(),s||(s={}),c(o,{not_found_error:!0,success:function(e){if("reserved"!=e.state)return console.log("item.state: ",e.state),void(s.error&&s.error(new g("item "+o+" isn't reserved")));if(e.ttr<=0)s.success&&s.success();else{var r=v.transaction(f.reserved,"readwrite");r.oncomplete=function(e){s.success&&s.success(e)},r.onerror=function(e){s.error&&s.error(e)};var t=r.objectStore(f.reserved),n=t.get(o);n.onsuccess=function(e){var r=n.result;r.expire=(new Date).getTime()+1e3*r.ttr,t.put(r)}}},error:s.error})},count_ready:function(e,r){if(d(),r||(r={}),a.tubes.indexOf(e)<0)throw new y("tube "+e+" doesn't exist");var t=null,n=v.transaction(e,"readonly");n.oncomplete=function(e){r.success&&r.success(t,e)},n.onerror=function(e){r.error&&r.error(e)};var o=n.objectStore(e).count();o.onsuccess=function(e){t=o.result}},Consumer:function(r,t){t||(t={});var n=t.tube?t.tube:"default",e=t.delay?t.delay:100,o=null,s=function(e){if(e||(e={}),o&&v){if(t.enable_fn&&!t.enable_fn())return!1;l({tube:n,success:function(e){e&&(r(e),setTimeout(s))}.bind(this)})}},u=(o=null,function(){return!o&&(o=setInterval(s,e),!0)});return u(),this.start=u,this.stop=function(){return!(!o||(clearInterval(o),o=null))},this}};return this.open=function(r){if(r||(r={}),v)throw new h("db is already open");var e=5e3+n,t=b.open(o,e);t.onerror=function(e){r.error&&r.error(e)},t.onsuccess=function(e){v=t.result,r.success&&r.success(e),s()},t.onupgradeneeded=function(e){var r=a.tubes;u(e,f.ids),u(e,f.reserved,{indexes:{expire:{index:"expire",unique:!1}}}),u(e,f.delayed,{indexes:{activate:{index:"activate",unique:!1}}}),u(e,f.buried,{indexes:{id:{unique:!1}}});for(var t=0;t<r.length;t++)0<=[f.reserved,f.buried].indexOf(r[t])||u(e,r[t],{indexes:{priority:{index:["priority","id"],unique:!1}}})}},this.close=e,this.is_open=function(){return!!v},this.wipe=function(){return e(),b.deleteDatabase(o),!0},this.Error=Error,this.Queue=t,this.promisify=function(){var s=this,e=function(n,o){return function(){var t=Array.prototype.slice.call(arguments,0);return t[o]||(t[o]={}),new Promise(function(e,r){t[o].success=e,t[o].error=r,n.apply(s,t)})}};return this.open=e(this.open,0),this.Queue.peek=e(this.Queue.peek,1),this.Queue.put=e(this.Queue.put,1),this.Queue.reserve=e(this.Queue.reserve,0),this.Queue.delete=e(this.Queue.delete,1),this.Queue.release=e(this.Queue.release,1),this.Queue.bury=e(this.Queue.bury,1),this.Queue.kick=e(this.Queue.kick,1),this.Queue.kick_job=e(this.Queue.kick_job,1),this.Queue.touch=e(this.Queue.touch,1),this.Queue.count_ready=e(this.Queue.count_ready,1),this}.bind(this),this.debug={get_db:function(){return v}},this};o.Error={DBClosed:m,DBOpened:h,BadTube:y,BadID:w,NotFound:g},e.Hustle=o}(window);