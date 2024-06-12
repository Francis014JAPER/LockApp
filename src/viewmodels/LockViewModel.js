import { makeAutoObservable, action } from 'mobx';
import axios from 'axios';
import io from 'socket.io-client';

class LockViewModel {
    locks = [];

    constructor() {
        makeAutoObservable(this, {
            fetchLocks: action,
            addLock: action,
            updateLock: action,
            deleteLock: action
        });
        this.fetchLocks();
        this.socket = io('http://192.168.0.107:5000');
        this.socket.on('lockChange', (locks) => {
            this.setLocks(locks);
        });
    }

    setLocks(locks) {
        this.locks = locks;
    }

    async fetchLocks() {
        try {
            const response = await axios.get('http://192.168.0.107:5000/locks');
            if (response.data) {
                const locksWithId = response.data.map((lock, index) => ({
                    ...lock,
                    id: lock._id || `generated-id-${index}`
                }));
                this.setLocks(locksWithId);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async addLock(lock) {
        try {
            const response = await axios.post('http://192.168.0.107:5000/locks', lock);
            if (response.data) {
                this.setLocks([...this.locks, response.data]);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async updateLock(id, updatedLock) {
        try {
            await axios.put(`http://192.168.0.107:5000/locks/${id}`, updatedLock);
            this.fetchLocks();
        } catch (error) {
            console.error(error);
        }
    }

    async deleteLock(id) {
        try {
            await axios.delete(`http://192.168.0.107:5000/locks/${id}`);
            this.fetchLocks();
        } catch (error) {
            console.error(error);
        }
    }
}

const lockViewModel = new LockViewModel();
export default lockViewModel;
