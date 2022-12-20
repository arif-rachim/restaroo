import {Page} from "./Page";
import {Header} from "../components/page-components/Header";
import {RouteProps} from "../components/useRoute";
import {Card, CardRow, CardTitle} from "../components/page-components/Card";
import {BsCreditCard2Front} from "react-icons/bs";
import {
    IoBagHandleOutline,
    IoChatboxOutline,
    IoHeartOutline,
    IoHomeOutline,
    IoInformationCircleOutline,
    IoLogInOutline,
    IoLogOutOutline,
    IoSettingsOutline,
    IoStarOutline
} from "react-icons/io5";
import {RefObject, useRef} from "react";
import invariant from "tiny-invariant";
import {RiDraftLine} from "react-icons/ri";
import {useProfile, useProfileSetter, useSessionIsActive} from "../model/useProfile";
import {Button} from "../components/page-components/Button";
import {ButtonTheme} from "./Theme";
import {Visible} from "../components/page-components/Visible";
import {useNavigate} from "../components/useNavigate";
import {GuestProfile} from "../model/Profile";
import {motion} from "framer-motion";

function ProfilePanel(props: { containerRef: RefObject<HTMLDivElement> }) {
    const isSessionActive = useSessionIsActive();
    const navigate = useNavigate();
    const user = useProfile();
    return <Card style={{margin: 10, marginBottom: -10}} ref={props.containerRef}>
        <Visible if={!isSessionActive}>
            <div style={{display: 'flex', flexDirection: 'column', padding: 10}}>
                <div style={{fontSize: 20, marginBottom: 5, fontWeight: 'bold'}}>Your profile</div>
                <div style={{marginBottom: 15}}>Log in or sign up to view your complete profile</div>
                <Button title={'Continue'} theme={ButtonTheme.danger} onTap={() => {
                    navigate('login')
                }} icon={IoLogInOutline}></Button>
            </div>
        </Visible>
        <Visible if={isSessionActive}>
            <div style={{display: 'flex', padding: 10}}>
                <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                    <div style={{fontSize: 23, fontWeight: 'bold', marginBottom: 10}}>{user.name}</div>
                    <div style={{marginBottom: 5}}>{user.email}</div>
                    <div>{user.username}</div>
                </div>
                <div style={{width: 80, height: 80, backgroundColor: '#CCC', borderRadius: 13}}>
                </div>
            </div>
        </Visible>
    </Card>;
}


export function AccountPage(props: RouteProps) {

    const containerRef = useRef<HTMLDivElement>(null);
    const isSessionActive = useSessionIsActive();
    const setUserProfile = useProfileSetter();
    const navigate = useNavigate();
    return <Page style={{padding: 0, background: '#F2F2F2'}}>
        <Header title={''}/>
        <div style={{display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto'}}>
            <ProfilePanel containerRef={containerRef}/>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'auto',
                padding: '30px 10px 50px 10px'
            }} onScroll={(event) => {
                invariant(containerRef.current);
                if ((event.target as HTMLDivElement).scrollTop < 20) {
                    containerRef.current.style.boxShadow = '0 0 5px 3px rgba(0,0,0,0.0)';
                    containerRef.current.style.zIndex = '0';
                    containerRef.current.style.transition = 'box-shadow 100ms ease-in-out';
                } else {
                    containerRef.current.style.boxShadow = '0 5px 5px -3px rgba(0,0,0,0.1)';
                    containerRef.current.style.zIndex = '1';
                    containerRef.current.style.transition = 'box-shadow 300ms ease-in-out';
                }
            }}>
                <div style={{display: 'flex', marginBottom: 20}}>
                    <motion.div style={{marginRight: 10, flexGrow: 1, display: 'flex', flexDirection: 'column'}}
                                whileTap={{scale: 0.95}} onClick={() => navigate('payment-method')}>

                        <Card style={{alignItems: 'center'}}>
                            <div style={{fontSize: 30}}>
                                <BsCreditCard2Front/>
                            </div>
                            <div>
                                Payments
                            </div>
                        </Card>

                    </motion.div>
                    <Card style={{flexGrow: 1, alignItems: 'center'}}>
                        <div style={{fontSize: 30}}>
                            <IoSettingsOutline/>
                        </div>
                        <div>
                            Settings
                        </div>
                    </Card>
                </div>
                <Card style={{padding: '15px 0px', marginBottom: 20}}>
                    <CardTitle title={'Food Orders'}/>
                    <CardRow icon={IoBagHandleOutline} title={'Your orders'}/>
                    <CardRow icon={IoHeartOutline} title={'Favorite orders'}/>
                    <CardRow icon={IoHomeOutline} title={'Address book'} onTap={() => {
                        navigate('address-book')
                    }}/>
                    <CardRow icon={IoChatboxOutline} title={'Online ordering help'}/>
                </Card>
                <Card style={{padding: '15px 0px'}}>
                    <CardTitle title={'More'}/>
                    <CardRow icon={IoInformationCircleOutline} title={'About'}/>
                    <CardRow icon={RiDraftLine} title={'Send feedback'}/>
                    <CardRow icon={IoStarOutline} title={'Rate us on play store'}/>
                    {isSessionActive &&
                        <CardRow icon={IoLogOutOutline} title={'Log out'} onTap={async () => {
                            // here we need to perform logout
                            await setUserProfile(GuestProfile);
                            navigate('delivery');
                        }}/>
                    }
                </Card>
            </div>
        </div>
    </Page>
}