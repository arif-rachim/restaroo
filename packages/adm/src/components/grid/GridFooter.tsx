import {BaseModel, blue, ListResult, Store, StoreValueRenderer} from "@restaroo/lib";
import {motion} from "framer-motion";
import {border} from "./Grid";

export function GridFooter(props: { collectionStore: Store<ListResult<BaseModel>>, loadCollection: (props: { page: number }) => Promise<void> }) {
    const {collectionStore, loadCollection} = props;
    return <StoreValueRenderer store={collectionStore} selector={s => [s.page, s.perPage, s.totalItems, s.totalPages]}
                               render={([page, perPage, totalItems, totalPage]: number[]) => {

                                   return <div style={{display: 'flex', padding: 5, justifyContent: 'flex-end'}}>
                                       {Array.from({length: 5}).map((_, index) => {
                                           if (page > 2) {
                                               if (page > (totalPage - 2)) {
                                                   return index + totalPage - 4;
                                               }
                                               return index - 2 + page
                                           }

                                           return index + 1;
                                       }).filter(t => t <= totalPage).map((val) => {
                                           const isSelected = val === page;
                                           return <motion.div key={val} style={{
                                               border: border,
                                               padding: 5,
                                               marginRight: 5,
                                               minWidth: 25,
                                               display: "flex",
                                               justifyContent: 'center',
                                               backgroundColor: isSelected ? blue : 'white',
                                               color: isSelected ? 'white' : 'black'
                                           }} whileTap={{scale: 0.95}} onClick={() => {
                                               loadCollection({page: val}).then()
                                           }}>{val}</motion.div>
                                       })}
                                   </div>
                               }}/>;
}