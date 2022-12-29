import {Page} from "./Page";
import {
    Button,
    ButtonTheme,
    Image,
    Input,
    RouteProps,
    StoreValue,
    useAppContext,
    useAppDimension,
    useNavigate,
    useStore,
    Value
} from "@restaroo/lib";
import {IoChevronDown, IoCloseCircleOutline, IoLogInOutline} from "react-icons/io5";
import {motion} from "framer-motion";
import {FcGoogle} from "react-icons/fc";
import {BsThreeDots} from "react-icons/bs";
import {useCallback} from "react";
import restaroo from "../assets/arif-rachim-restaroo.png";
import invariant from "tiny-invariant";


export function LoginOrSignup(route: RouteProps) {
    const {appDimension} = useAppDimension();
    const {showPicker} = useAppContext();
    const countryStore = useStore('+971');
    const phoneNumberStore = useStore({value: '', error: ''});
    const storeValid = useCallback(() => {
        if (phoneNumberStore.stateRef.current.value === '') {
            phoneNumberStore.setState(old => ({...old, error: 'Phone no is required'}));
            return false;
        }
        return true;
    }, [phoneNumberStore]);
    const navigate = useNavigate();
    return <Page>

        <div style={{backgroundColor: 'red', position: 'absolute', top: 0}}>
            <Image src={restaroo} height={appDimension.width} width={appDimension.width}/>
        </div>
        <div style={{flexGrow: 1}}/>

        <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: 20,
            backgroundColor: 'white',
            position: 'relative'
        }}>
            <div style={{
                position: 'absolute',
                top: -60,
                color: 'black',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <motion.div whileTap={{scale: 0.9}} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '3px 10px',
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    borderRadius: 20
                }}
                            onTap={() => {
                                window.history.back();
                            }}>
                    <div style={{marginRight: 5, fontSize: 12}}>Skip</div>
                    <IoCloseCircleOutline style={{fontSize: 25}}/>
                </motion.div>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                fontSize: 25,
                textAlign: 'center',
                padding: '0px 50px',
                marginBottom: 30
            }}>
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
            <div style={{display: 'flex', marginBottom: 10}}>
                <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                    <StoreValue store={phoneNumberStore} property={['value', 'error']}
                                selector={[s => s.value, s => s.error]}>
                        <Input title={<motion.div style={{display: 'flex', width: '100%', paddingTop: 2}}
                                                  whileTap={{scale: 0.9}}
                                                  onClick={(event) => {
                                                      event.preventDefault();
                                                      event.stopPropagation();
                                                  }}
                                                  onTap={async (event) => {
                                                      event.preventDefault();
                                                      event.stopPropagation();
                                                      const country = await showPicker({
                                                          picker: 'country',
                                                          value: countryStore.stateRef.current
                                                      });
                                                      countryStore.setState(country);
                                                  }}>
                            <div style={{marginTop: 2, marginRight: 5}}><IoChevronDown/></div>
                            <StoreValue store={countryStore} selector={s => s} property={'value'}>
                                <Value style={{flexGrow: 1, textAlign: 'right', fontSize: 20}}/>
                            </StoreValue>
                        </motion.div>} placeholder={'Enter Phone Number'} titleWidth={90} titlePosition={'left'}
                               style={{containerStyle: {borderBottom: 'unset'}}}
                               inputMode={"tel"}
                               type={'tel'}
                               onChange={(event) => {
                                   phoneNumberStore.setState({value: event.target.value, error: ''});
                               }}
                        />
                    </StoreValue>
                </div>
            </div>
            <Button title={'Continue'} onTap={() => {
                if (storeValid()) {
                    invariant(countryStore.stateRef.current);
                    navigate(`otp/${countryStore.stateRef.current}${phoneNumberStore.stateRef.current.value}`)
                }
            }} theme={ButtonTheme.danger} icon={IoLogInOutline} style={{marginBottom: 30}}/>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderTop: '1px solid rgba(0,0,0,0.1)'
            }}>
                <div style={{marginTop: -20, backgroundColor: 'white', padding: 10, fontSize: 14}}>or
                </div>
            </div>

            <div style={{display: 'flex', justifyContent: 'center', marginBottom: 50}}>
                <motion.div style={{
                    fontSize: 30,
                    width: 30,
                    height: 30,
                    padding: 10,
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: 50,
                    marginRight: 30
                }} whileTap={{scale: 0.9}}>
                    <FcGoogle/>
                </motion.div>
                <motion.div style={{
                    fontSize: 30,
                    width: 30,
                    height: 30,
                    padding: 10,
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: 50
                }} whileTap={{scale: 0.9}}>
                    <BsThreeDots/>
                </motion.div>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div>By continuing, you agree to our</div>
                <div style={{display: 'flex'}}>
                    <div style={{marginRight: 10, borderBottom: '1px dashed rgba(0,0,0,0.5)'}}>Terms of Service</div>
                    <div style={{marginRight: 10, borderBottom: '1px dashed rgba(0,0,0,0.5)'}}>Privacy Policy</div>
                    <div style={{marginRight: 10, borderBottom: '1px dashed rgba(0,0,0,0.5)'}}>Content Policy</div>
                </div>
            </div>
        </div>

    </Page>
}
