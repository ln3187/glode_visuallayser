import { setViewer } from "../js/setviewer.js";
import { constance } from "../js/const.js";
import { init_datetime } from "../js/init_draw_and_view.js"

const e = React.createElement;

function create_option(input_data) {
    var list = []
    const data = input_data
    for (var i in input_data) {
        list.push(<option>{data[i]}</option>);
    }

    return list
}

const _com = new constance()
const region = _com.region
const endpoint = _com.endpoint
const viewerIdArray = _com.viewerIdArray
AWS.config.region = region;
const s3 = new AWS.S3({ apiVersion: "2014-10-01", endpoint: new AWS.Endpoint(endpoint) });
const _propertyArray = _com.aipPropertyArray
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4ODliN2Q1NS1hYTkwLTQxYWQtOTVjMy01NzFlMGRkZThhYmEiLCJpZCI6Mzc1MjUsImlhdCI6MTYwNTE2MjMxNn0.NJ33oqQu8VeX6Yh55y4TiOCtFe5Cxfk6UbddVUorHWo';


class LikeButton extends React.Component {

    constructor(props) {
        super(props);
        console.log(this.props.param)
        this.state = {
            year: this.props.param["year"],
            monthday: this.props.param["monthday"],
            hourminute: this.props.param["hourminute"],
            viewerArray: [],
            imageryLayers: ""
        };
        this.input_year_data = [2020, 2019, 2018]
        this.input_monthday_data = [1124, 1123, 1126]
        this.input_hourminute_data = [1200, 1300, 1400]

        this.custom_render_loop = this.custom_render_loop.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.rend_flag = 0
    

    }

    handleChange(event){
        const type = event.target.id
        console.log(event.target.value)
        const val = Number(event.target.value)
        if (type == "year") {
            this.setState({ year: val });
        } else if (type == "monthday") {
            this.setState({ monthday: val });
        } else {
            this.setState({ hourminute: val });
        }
    }


    componentDidUpdate() {
        console.log(this.state.hourminute)
        console.log("Did update !")


        const Dom_param_dic = {
            year: this.state.year,
            monthday: this.state.monthday,
            hourminute: this.state.hourminute
        }
        console.log(Dom_param_dic)
        setViewer(this.state.imageryLayers, this.state.viewerArray, Dom_param_dic, _propertyArray, 0)

        for (let i = 0; i < viewerIdArray.length; i++) {
            this.state.viewerArray[i].scene.requestRender();
        };

        this.rend_flag = 0
        this.custom_render_loop()

    }


    custom_render_loop(){
        for (let i = 0; i < viewerIdArray.length; i++) {
            this.state.viewerArray[i].scene.requestRender();
        }

        if (this.rend_flag == 50){
            return
        }else{
            this.rend_flag =this.rend_flag + 1
            window.requestAnimationFrame(this.custom_render_loop);
        }
    }



    componentDidMount() {
        console.log("didmount")
        init_datetime(s3).then((Dom_param_dic, OptionDic)=>{
            console.log(OptionDic)
        })
        
        let viewerArray = []
        viewerIdArray.forEach(viewerId => {
            console.log(viewerId)
            const viewer = new Cesium.Viewer(viewerId, {
                requestRenderMode: true,
                maximumRenderTimeChange: 10,
                useDefaultRenderLoop: true
            })
            viewerArray.push(viewer);
        })
        let imageryLayers = viewerArray[0].imageryLayers
        this.setState({
            viewerArray: viewerArray,
            imageryLayers: imageryLayers
        });

    }


    render() {

        const year_list = create_option(this.input_year_data)
        const month_list = create_option(this.input_monthday_data)
        const hour_list = create_option(this.input_hourminute_data)


        return (
            <div>
                <div>
                    <select id="year" value={this.state.year} onChange={this.handleChange}>
                        {year_list}
                    </select>
                    <select id="monthday" value={this.state.monthday} onChange={this.handleChange}>
                        {month_list}
                    </select>
                    <select id="hourminute" value={this.state.hourminute} onChange={this.handleChange}>
                        {hour_list}
                    </select>
                </div>

                <div className="v" id="viewer11"></div>
                <div className="v" id="viewer12"></div>
                <div className="v" id="viewer13"></div>
                <br></br>
                <div className="v" id="viewer21"></div>
                <div className="v" id="viewer22"></div>
                <div className="v" id="viewer23"></div>

                <div style={{ visibility: "hidden" }} id="controleViewer"></div>
                <div style={{ visibility: "hidden" }} id="c"></div>

            </div>
        );
    }
}


const Dom_param_dic = { year: 2020, monthday: 1124, hourminute: 1200 }
const domContainer = document.getElementById('app');
const figure = <LikeButton param={Dom_param_dic} />
ReactDOM.render(figure, domContainer);



