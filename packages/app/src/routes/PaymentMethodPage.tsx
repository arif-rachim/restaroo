import {Card, CardRow, CardTitle, Header, pageBackgroundColor, RouteProps} from "@restaroo/lib";
import {Page} from "./Page";
import {HiCreditCard} from "react-icons/hi";

export function PaymentMethodPage(route: RouteProps) {
    return <Page style={{backgroundColor: pageBackgroundColor}}>
        <Header title={'Manage Payment Methods'}/>
        <div style={{display: 'flex', flexDirection: 'column', padding: 10}}>
            <Card>
                <CardTitle title={'Cards'}/>
                <CardRow title={<div style={{display: 'flex', flexDirection: 'column', fontSize: 13, padding: 5}}>
                    <div>Personal</div>
                    <div>****** 8875</div>
                </div>} icon={HiCreditCard} onTap={() => {
                }}/>
            </Card>
        </div>
    </Page>
}