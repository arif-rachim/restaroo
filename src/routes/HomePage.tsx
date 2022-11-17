import {Header} from "../components/page-components/Header";
import {Input} from "../components/page-components/Input";

export function HomePage() {

    return <div style={{paddingTop: 50}}>
        <Header title={'Home Page'}/>
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <Input title={'Date'} titlePosition={'left'} titleWidth={50} placeholder={'Please select date'} />
            <Input title={'Time'} titlePosition={'left'} titleWidth={50}  placeholder={'Please select time'}/>
        </div>

    </div>
}