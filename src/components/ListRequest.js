import React from 'react';
import '../ListRequest.css';

import TableBoot from './TableBoot';
import BaseCard from './BaseCard';
import individualOrderImage from '../images/individual-order.png';
import vehicleOrderImage from '../images/vehicle-order.png';
import api from '../api';
import sortBy from 'lodash.sortby'

class ListRequest extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            organizationName: '',
            orderList: [],
            file: null,
            type: 'person',
            fetchError: '',
            person: true,
            vehicle: false,
        };
        // this.sampleFunction = this.sampleFunction.bind(this);
        this.createRequest = this.createRequest.bind(this);
        this.onFileChangeHandler = this.onFileChangeHandler.bind(this);
        this.createStaticData = this.createStaticData.bind(this);
        this.onVehicle = this.onVehicle.bind(this);
        this.onPerson = this.onPerson.bind(this);
    }

    async componentDidMount() {
        //get all orders
        await this.fetchAllOrders();
    }

    fetchAllOrders = async () => {
        try {
            const response = await api.getAllOrders();
            if (response.status === 200) {
                this.setState({ orderList:  sortBy(response.data.orders,'createdAt').reverse() });
            } else {
                await this.createStaticData();
            }
        } catch (error) {
            this.setState({ fetchError: error.toString() });
            await this.createStaticData();
        }
    };

    //placeholder data
    async createStaticData() {
        await this.setState({
            orderList: [
                {
                    id: '',
                    accountId: '',
                    orderStatus: '',
                    orderType: '',
                    requestCount: '100',

                    district: 'Bengaluru',
                    type: 'VEHICLE',
                    status: 'Approved',
                    createdAt: '25/03/2020 | 07:01 am',
                    pdfUrl:
                        'https://www.who.int/docs/default-source/coronaviruse/situation-reports/20200308-sitrep-48-covid-19.pdf',
                },
                {
                    requestCount: '300',
                    district: 'Bengaluru',
                    type: 'PERSON',
                    status: 'Pending',
                    createdAt: '30/04/2020 | 10:01 pm',
                    pdfUrl: null,
                },
            ],
        });
    }

    async createRequest() {
        // create request to save file
        if (!this.state.type && !this.state.file) {
            return;
        }
        try {
            let formData = new FormData(); //formdata object
            formData.append('file', this.state.file); //append the values with key, value pair
            formData.append('orderType', this.state.type);
            formData.append('authToken', localStorage.getItem('auth'));

            const response = await api.createOrder(formData);
            await this.fetchAllOrders();
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    async onFileChangeHandler(event) {
        await this.setState({ file: event.target.files[0] });
    }

    async onVehicle() {
        await this.setState({
            type: 'vehicle',
            person: false,
            vehicle: true,
        });
    }

    async onPerson() {
        await this.setState({
            type: 'person',
            person: true,
            vehicle: false,
        });
    }

    deleteFile = (e) => {
        e.preventDefault();
        this.setState({ file: null });
    };

    render() {
        return (
            <div className='padding-46'>
                <div className='action-container'>
                    <BaseCard isActive={this.state.person} onClick={this.onPerson}>
                        <img height='60' src={individualOrderImage} />
                    </BaseCard>
                    <BaseCard isActive={this.state.vehicle} onClick={this.onVehicle}>
                        <img height='50' src={vehicleOrderImage} />
                    </BaseCard>
                    <div className='separator'></div>
                    <BaseCard isActive={true}>
                        <a>Download Sample file</a>
                    </BaseCard>

                    <label htmlFor='file-upload' className='upload-container'>
                        {this.state.file ? (
                            <div className='file-name'>
                                File: {this.state.file.name}{' '}
                                <span onClick={this.deleteFile} className='delete-file-icon'>
                                    &#x2715;
                                </span>
                            </div>
                        ) : (
                            <>
                                <label htmlFor='file-upload'>Upload file</label>
                                <input
                                    hidden
                                    id='file-upload'
                                    type='file'
                                    accept='.csv'
                                    onChange={this.onFileChangeHandler}
                                />
                            </>
                        )}
                    </label>

                    <BaseCard
                        isActive={!!this.state.file}
                        onClick={this.createRequest}
                        class='send-request-btn'>
                        Send Request
                    </BaseCard>
                </div>
                <TableBoot rows={this.state.orderList} />
            </div>
        );
    }
}
export default ListRequest;
