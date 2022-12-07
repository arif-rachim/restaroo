import {RouteProps} from "../components/useRoute";
import {Page} from "./Page";
import {Header} from "../components/page-components/Header";
import {Card, CardRow, CardTitle} from "../components/page-components/Card";
import {HiCreditCard} from "react-icons/hi";

export function PaymentMethodPage(route: RouteProps) {
    return <Page style={{backgroundColor: '#F2F2F2'}}>
        <Header title={'Manage Payment Methods'}/>
        <div style={{display: 'flex', flexDirection: 'column', padding: 10}}>
            <Card>
                <CardTitle title={'Cards'}/>
                <CardRow title={<div style={{display: 'flex', flexDirection: 'column', fontSize: 13}}>
                    <div>Personal</div>
                    <div>****** 8875</div>
                </div>} icon={HiCreditCard} onTap={() => {
                }}/>
            </Card>
        </div>
        This is my payment method
    </Page>
}