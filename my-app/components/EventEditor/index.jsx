import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { FileUpload } from 'primereact/fileupload';
import styles from './style.module.scss';

const EventEditor = (props) => {
    return (
        <>
            <div className="p-field p-md-4 p-pl-0">
                <span className="p-float-label">
                    <InputText id='name' value={props.name} onChange={(e) => props.ChangeName(e.target.value)} />
                    <label htmlFor="name">Name</label>
                </span>
            </div>
            <div className="p-field p-md-4 p-pl-0">
                <span className="p-float-label">
                    <InputTextarea id='description' value={props.description} onChange={(e) => props.ChangeDescription(e.target.value)} autoResize className={styles.description} />
                    <label htmlFor="description">Description</label>
                </span>
            </div>
            <div className="p-field p-md-4 p-pl-0">
                <span className="p-float-label">
                    <Calendar id='dateStart' value={props.dateStart} onChange={(e) => props.ChangeDateStart(e.value)} />
                    <label htmlFor="dateStart">Date start</label>
                </span>
            </div>
            <div className="p-field p-md-4 p-pl-0">
                <span className="p-float-label">
                    <Calendar id='dateEnd' value={props.dateEnd} onChange={(e) => props.ChangeDateEnd(e.value)} />
                    <label htmlFor="dateEnd">Date end</label>
                </span>
            </div>
            <div className="p-field p-md-4 p-pl-0">
                <span className="p-float-label">
                    <MultiSelect id="companions" value={props.companions} onChange={(e) => {
                        props.ChangeCompanions(e.value)
                    }} options={props._companions} optionLabel="name" className={styles.multi} />
                    <label htmlFor="companions">Companions</label>
                </span>
            </div>
            <div className="p-field p-md-4 p-pl-0">
                <span className="p-float-label">
                    <InputText id='location' value={props.location} onChange={(e) => props.ChangeLocation(e.target.value)} />
                    <label htmlFor="location">Loaction</label>
                </span>
            </div>
            <div className="p-field p-md-4 p-pl-0">
                <span className="p-float-label">
                    <MultiSelect id="subjects" value={props.subjects} onChange={(e) => {
                        props.ChangeSubjects(e.value)
                    }} options={props._subjects} optionLabel="name" className={styles.multi} />
                    <label htmlFor="subjects">Subjects</label>
                </span>
            </div>
            {
                props.onUpload !== undefined ?
                    <div>
                        <div className="card">
                            <h5>Upload images</h5>
                            <FileUpload name="image" customUpload uploadHandler={props.onUpload} maxFileSize={10000000}
                                emptyTemplate={<p className="p-m-0">Drag and drop files to here to upload.</p>} />
                        </div>
                    </div>
                    : <></>
            }
        </>
    )
}

export default EventEditor;