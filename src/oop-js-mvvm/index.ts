class ViewModel {
    private static checker:Symbol = Symbol();

    attribute = {};
    events = {};
    children:{[key:string]:any} = {};

    static get(data:any):ViewModel{
        return new ViewModel(this.checker, data)
    }

    constructor(checker:Symbol, data : {[key:string]: any}){
        if (checker != ViewModel.checker) throw "use ViewModel.get() !!";
        Object.entries(data).forEach(([key, value]) => {
            switch (key) {
              case "attribute":
                this.attribute = value;
                break;
              case "events":
                this.events = value;
                break;
              default:
                this.children[key] = value;
                break;
            }
          });
        Object.seal(this);
    }
}

class BinderItem {
    el:Element = null;
    viewModelName:string = "";
    constructor(el:Element, viewModelName:string){
        this.el = el;
        this.viewModelName = viewModelName;
        Object.freeze(this);
    }
}

class Binder {
    private items = new Set<BinderItem>();
    add(item : BinderItem){
        this.items.add(item);
    };

    render(viewModel : ViewModel){
        this.items.forEach((item:BinderItem)=>{
            const vm:ViewModel = viewModel.children[item.viewModelName];
            const el:Element = item.el;
            Object.entries(vm.attribute).forEach(([key, value]:[string,string]) => {
                    el.setAttribute(key, value)
                }
            );
            Object.entries(vm.events).forEach(
                ([key, value]:[string,Function]) =>{
                    el.addEventListener(key, value.bind(viewModel));
                } 
            );
        })
    }
}

class Scanner{
    scan(el:Element){
        const binder = new Binder();
        this.checkItem(binder, el);

        const stack = [el.firstElementChild];
        let target:Element;
        while ((target = stack.pop())) {
            this.checkItem(binder, target);
            if (target.firstElementChild) stack.push(target.firstElementChild);
            if (target.nextElementSibling) stack.push(target.nextElementSibling);
        }
        return binder;
    }

    checkItem(binder : Binder, el : Element) {
        const viewModelName = el.getAttribute("data-viewmodel");
        if (viewModelName) binder.add(new BinderItem(el, viewModelName));
      }
}