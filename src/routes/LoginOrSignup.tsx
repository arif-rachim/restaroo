import {Page} from "./Page";
import {RouteProps} from "../components/useRoute";
import {Input} from "../components/page-components/Input";
import {IoChevronDown} from "react-icons/io5";
import {motion} from "framer-motion";
import {useAppContext} from "../components/useAppContext";
import {countryList} from "../components/page-components/picker/CountryPicker";
export function LoginOrSignup(route: RouteProps) {
    const appContext = useAppContext();

    return <Page>
        <div style={{display: 'flex', flexDirection: 'column', padding: 20}}>
            <div style={{display: 'flex', flexDirection: 'column', fontSize: 25, textAlign: 'center', padding: 50}}>
                Dubai's Food Delivery and Dining App
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderTop: '1px solid rgba(0,0,0,0.1)'
            }}>
                <div style={{marginTop: -20, backgroundColor: 'white', padding: 10, fontSize: 14}}>Log in or sign up
                </div>
            </div>
            <div style={{display: 'flex'}}>
                <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                    <Input title={<motion.div style={{display: 'flex'}} whileTap={{scale:0.9}} onTap={async () => {
                        const country = await appContext.showPicker({picker:'country',value:countryList.find(c => c.code === 'AE')});
                    }}>
                        <div style={{marginTop: 2, marginRight: 5}}><IoChevronDown/></div>
                        <div>+971</div>
                    </motion.div>} placeholder={'Enter Phone Number'} titleWidth={70} titlePosition={'left'}
                           style={{containerStyle: {borderBottom: 'unset'}}}
                           inputMode={"tel"}
                           type={'tel'}

                    />
                </div>
            </div>
        </div>
    </Page>
}