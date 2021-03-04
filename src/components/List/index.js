let state = null;

const List = {
    async beforeRender(){

    },

    // 라우터에서는 컴포넌트 render 함수 트리거하는것만.. Dom paint 함수는 여기내부에서쓰자
    render(root){
        let template = ''
        try{
            // api 호출
            // 템플릿 그리기
            Dom.paint();
        }catch{
        }
    },

    afterRender(){

    }
}

export default List;