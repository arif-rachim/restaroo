import {Page} from "./Page";
import {RouteProps} from "../components/useRoute";
import {Input} from "../components/page-components/Input";
import {IoChevronDown, IoCloseCircleOutline, IoLogInOutline} from "react-icons/io5";
import {motion} from "framer-motion";
import {useAppContext} from "../components/useAppContext";
import {countryList} from "../components/page-components/picker/CountryPicker";
import {StoreValue, useStore} from "../components/store/useStore";
import {Button} from "../components/page-components/Button";
import {ButtonTheme} from "./Theme";
import {FcGoogle} from "react-icons/fc";
import {BsThreeDots} from "react-icons/bs";
import {useCallback} from "react";
import {Image} from "../components/page-components/Image";
import restaroo from "../assets/arif-rachim-restaroo.png";
import {useNavigate} from "../components/useNavigate";
import invariant from "tiny-invariant";
const defaultCountry = countryList.find(c => c.code === 'AE');

export function LoginOrSignup(route: RouteProps) {
    const appContext = useAppContext();
    const countryStore = useStore(defaultCountry);
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

        <div style={{backgroundColor:'red',position:'absolute',top:0}}>
            <Image src={restaroo} height={appContext.appDimension.width} width={appContext.appDimension.width}/>
        </div>
        <div style={{flexGrow:1}}/>

        <div style={{display: 'flex', flexDirection: 'column', padding: 20,backgroundColor:'white',position:'relative'}}>
            <div style={{position:'absolute',top:-60,color:'black',textAlign:'center',display:'flex',justifyContent:'center'}} >
            <motion.div whileTap={{scale: 0.9}} style={{display:'flex',alignItems:'center',padding:'3px 10px',backgroundColor:'rgba(255,255,255,0.7)',borderRadius:20}}
                        onTap={() => {
                            window.history.back();
                        }}>
                <div style={{marginRight:5,fontSize:12}}>Skip</div>
                <IoCloseCircleOutline style={{fontSize: 25}}/>
            </motion.div>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', fontSize: 25, textAlign: 'center', padding: '0px 50px',marginBottom:30}}>
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
                        <Input title={<motion.div style={{display: 'flex', width: '100%'}} whileTap={{scale: 0.9}}
                                                  onClick={(event) => {
                                                      event.preventDefault();
                                                      event.stopPropagation();
                                                  }}
                                                  onTap={async (event) => {
                                                      event.preventDefault();
                                                      event.stopPropagation();
                                                      const country = await appContext.showPicker({
                                                          picker: 'country',
                                                          value: countryStore.stateRef.current
                                                      });
                                                      countryStore.setState(country);
                                                  }}>
                            <div style={{marginTop: 2, marginRight: 5}}><IoChevronDown/></div>
                            <StoreValue store={countryStore} selector={s => s?.dial_code} property={'value'}>
                                <Title/>
                            </StoreValue>
                        </motion.div>} placeholder={'Enter Phone Number'} titleWidth={70} titlePosition={'left'}
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
                    // lets continue validate phone here
                    // first we are sending the otp to user
                    invariant(countryStore.stateRef.current);
                    navigate(`otp/${countryStore.stateRef.current.dial_code}${phoneNumberStore.stateRef.current.value}`)
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

            <div style={{display: 'flex', justifyContent: 'center',marginBottom:50}}>
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

function Title(props: { value?: string }) {
    return <div style={{flexGrow: 1, textAlign: 'right'}}>{props.value}</div>
}