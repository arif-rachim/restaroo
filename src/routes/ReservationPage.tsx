import {Page} from "./Page";
import {useFocusListener} from "../components/RouterPageContainer";
import {adjustThemeColor} from "../components/page-components/adjustThemeColor";
import {RouteProps} from "../components/useRoute";

import {Header} from "../components/page-components/Header";
import {dateToDdd, dateToDdMmm, dateToDdMmmYyyy} from "../components/page-components/utils/dateToDdMmmYyyy";
import {dateAdd} from "../components/page-components/utils/dateAdd";
import {dateToHhMm, hhMmToDate} from "../components/page-components/utils/dateToHhMm";
import {useEffect, useMemo} from "react";
import {useAppContext} from "../components/useAppContext";
import {StoreValue, useStore} from "../components/store/useStore";
import {motion} from "framer-motion";
import {ValueOnChangeProperties} from "../components/page-components/picker/createPicker";
import {blue, ButtonTheme, white} from "./Theme";
import produce from "immer";
import {Input} from "../components/page-components/Input";
import {MdCancel} from "react-icons/md";
import {useUserProfile} from "../model/useUserProfile";
import {Button} from "../components/page-components/Button";
import {IoSaveOutline} from "react-icons/io5";


const THIRTY_MINUTES = 1000 * 60 * 30;

interface Reservation {
    dateTime: Date,
    people: number,
    seatingPreferences: string,
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNo: string
}

function DateSelector(props: ValueOnChangeProperties<Date>) {
    const {value, onChange} = props;

    return <div style={{
        display: 'flex',
        overflowY: 'hidden',
        overflowX: 'auto',
        scrollSnapType: 'x mandatory',
        paddingBottom: 20
    }}>
        {Array.from({length: 8}).map((_, index) => {
            const date = dateAdd(new Date()).date(index);

            const isSelected = dateToDdMmmYyyy(date) === dateToDdMmmYyyy(value);

            const label = index < 2 ? ['Today', 'Tomorrow'][index] : dateToDdd(date);
            return <motion.div style={{
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid rgba(0,0,0,0.1)',
                padding: '10px 30px',
                marginRight: 10,
                alignItems: 'center',
                scrollSnapAlign: 'center',
                backgroundColor: isSelected ? blue : white,
                color: isSelected ? white : 'unset'
            }} key={index} whileTap={{scale: 0.95}} onTap={() => onChange ? onChange(date) : ''}>
                <div style={{marginBottom: 3}}>{label}</div>
                <div style={{
                    whiteSpace: 'nowrap',
                    fontWeight: 'bold',
                    fontSize: 14
                }}>{dateToDdMmm(date)}</div>
            </motion.div>
        })}
    </div>;
}

function TimeSelector(props: ({ openingTime: string, closingTime: string } & ValueOnChangeProperties<Date>)) {
    const {openingTime, closingTime, value, onChange} = props;

    const times: Date[] = useMemo(() => {
        const startTime = hhMmToDate(openingTime);
        const endTime = hhMmToDate(closingTime);

        if (startTime && endTime) {
            const difference = endTime?.getTime() - startTime?.getTime();
            const steps = Math.round(difference / THIRTY_MINUTES);
            const times = Array.from({length: steps}).map((_, index) => {
                return dateAdd(startTime).minute(30 * index);
            });
            return times;
        }
        return [];
    }, [openingTime, closingTime]);
    return <div style={{
        display: 'flex',
        overflowY: 'hidden',
        overflowX: 'auto',
        scrollSnapType: 'x mandatory',
        paddingBottom: 20
    }}>
        {times.map((time, index) => {
            const isSelected = dateToHhMm(time) === dateToHhMm(value);
            return <motion.div style={{
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid rgba(0,0,0,0.1)',
                padding: '20px 30px',
                marginRight: 10,
                alignItems: 'center',
                scrollSnapAlign: 'center',
                backgroundColor: isSelected ? blue : white,
                color: isSelected ? white : 'unset'
            }} key={index} whileTap={{scale:0.95}} onTap={() => onChange ? onChange(time) : ''}>
                <div style={{fontSize: 16}}>{dateToHhMm(time)}</div>
            </motion.div>
        })}
    </div>;
}

function NumberOfPeopleSelector(props:ValueOnChangeProperties<number>) {
    const {value,onChange} = props;
    return <div style={{
        display: 'flex',
        overflowY: 'hidden',
        overflowX: 'auto',
        scrollSnapType: 'x mandatory',
        paddingBottom: 20
    }}>
        {Array.from({length: 21}).map((_, index) => {
            const total = index + 1;
            const isSelected = total === value;
            return <motion.div style={{
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid rgba(0,0,0,0.1)',
                padding: '20px 30px',
                marginRight: 10,
                alignItems: 'center',
                scrollSnapAlign: 'center',
                backgroundColor: isSelected ? blue : white,
                color: isSelected ? white : 'unset'
            }} key={index} whileTap={{scale:0.95}} onTap={() => onChange ? onChange(total) : ''}>
                <div style={{fontSize: 16}}>{total}</div>
            </motion.div>
        })}
    </div>;
}

export function ReservationPage(props: RouteProps) {

    const openingTime: string = '11:00';
    const closingTime: string = '24:00';
    const context = useAppContext();
    const nextAvailableTime = useMemo(() => {
        const time = new Date().getTime();
        return new Date((time - (time % THIRTY_MINUTES)) + THIRTY_MINUTES)
    }, []);
    const user = useUserProfile();

    const store = useStore<(Reservation & {
        errors: {
            people: string,
            seatingPreferences: string,
            firstName: string,
            lastName: string,
            phoneNo: string
        }
    })>({
        dateTime: nextAvailableTime,
        firstName: user.name,
        email: user.email,
        seatingPreferences: 'Indoor Seating, Non Smoking Area',
        people: 0,
        lastName: '',
        phoneNo: user.phoneNo,
        id: '',
        errors: {
            firstName: '',
            lastName: '',
            people: '',
            phoneNo: '',
            seatingPreferences: ''
        }
    })
    useEffect(() => {
        store.setState(produce(s => {
            s.firstName = user.name;
            s.email = user.email;
            s.phoneNo = user.phoneNo;
        }));
    },[user,store])

    useFocusListener(props.path, () => {
        adjustThemeColor('#FFF');
    });

    return <Page>
        <Header title={'Book a Table'} size={"big"}></Header>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '30px 15px 100px 15px',
            overflow: 'auto'
        }}>
            <div style={{display: 'flex', flexDirection: 'column', marginBottom: 10}}>
                <div style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>What Day ?</div>
                <StoreValue store={store} property={'value'} selector={s => s.dateTime}>
                    <DateSelector onChange={(date) => {
                        store.setState(produce(s => {
                            s.dateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), s.dateTime.getHours(), s.dateTime.getMinutes(), 0);
                        }));
                    }}/>
                </StoreValue>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', marginBottom: 10}}>
                <div style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>How Many People ?</div>
                <StoreValue store={store} property={'value'} selector={s => s.people}>
                    <NumberOfPeopleSelector onChange={(value) => {
                        store.setState(produce(s => {
                            s.people = value;
                        }));
                    }}/>
                </StoreValue>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', marginBottom: 10}}>
                <div style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>What Time ?</div>
                <StoreValue store={store} property={'value'} selector={s => s.dateTime}>
                    <TimeSelector closingTime={closingTime} openingTime={openingTime} onChange={(time) => {
                        store.setState(produce(s => {
                            s.dateTime = new Date(s.dateTime.getFullYear(), s.dateTime.getMonth(), s.dateTime.getDate(), time.getHours(), time.getMinutes(), 0);
                        }));
                    }}/>
                </StoreValue>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', marginBottom: 20}}>
                <div style={{fontSize: 18, fontWeight: 'bold', marginBottom: 5}}>Seating Preferences ?</div>
                <div style={{display: 'flex'}}>
                    <div style={{flexGrow: 1, fontSize: 16}}>
                        <StoreValue store={store} property={'value'} selector={s => s.seatingPreferences}>
                            <Title />
                        </StoreValue>
                    </div>
                    <motion.div style={{color: 'red', marginLeft: 10}} onTap={async () => {
                        const result = await context.showPicker({
                            picker: {
                                dataProvider: ['Indoor Seating, Non Smoking Area', 'Outdoor'],
                                dataToLabel: d => d,
                                dataToValue: v => v,
                                valueToData: v => v,
                            }, value: store.stateRef.current.seatingPreferences
                        });
                        store.setState(produce(s => {
                            s.seatingPreferences = result;
                        }));
                    }} whileTap={{scale: 0.9}}>Change
                    </motion.div>
                </div>
            </div>

            <div style={{display: 'flex', flexDirection: 'column'}}>
                <div style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Personal Details</div>
                <div style={{display: 'flex'}}>
                    <div style={{display: 'flex', flexDirection: 'column', fontSize: 16, flexGrow: 1}}>
                        <StoreValue store={store} selector={s => `${s.firstName} ${s.lastName}, ${s.phoneNo}`} property={'value'}>
                            <Title/>
                        </StoreValue>

                        <StoreValue store={store} selector={s => `${s.email}`} property={'value'}>
                            <Title/>
                        </StoreValue>
                    </div>
                    <motion.div style={{color: 'red', marginLeft: 10}} onTap={async () => {
                        await context.showSlidePanel(closePanel => {
                            return <div style={{display:'flex',flexDirection:'column',backgroundColor:'white',borderTopRightRadius:15,borderTopLeftRadius:15,padding:10}}>
                                <div style={{display: 'flex', justifyContent: 'center', marginTop: -60, paddingBottom: 20}}>
                                    <motion.div onTap={() => {
                                        closePanel(false)
                                    }} whileTap={{scale: 0.95}}>
                                        <MdCancel fontSize={40} style={{color: "white"}}/>
                                    </motion.div>
                                </div>
                                <Input title={'First name'} placeholder={'enter your first name'} defaultValue={store.stateRef.current.firstName}/>
                                <Input title={'Last name'} placeholder={'enter your first name'} defaultValue={store.stateRef.current.lastName}/>
                                <Input title={'Email'} placeholder={'enter your email'} defaultValue={store.stateRef.current.email}/>
                                <Input title={'Phone'} placeholder={'enter your phone number'} defaultValue={store.stateRef.current.phoneNo}/>
                                <Button onTap={() => {
                                    // TODO
                                    closePanel({});
                                }} title={'Save Changes'} icon={IoSaveOutline} theme={ButtonTheme.danger} />
                            </div>
                        })
                    }} whileTap={{scale: 0.9}}>Change
                    </motion.div>
                </div>
            </div>
        </div>
    </Page>
}

function Title(props:{value?:string}){
    return <div>{props.value}</div>
}