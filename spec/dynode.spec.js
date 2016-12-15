const { observable, observe } = require('mobx');
const dynode = require('../src/dynode.js');
const cloneDeep = require('lodash.clonedeep');

describe('selector', () => {
    const state = {
        company: "Data Zoo",
        employees: [{
            firstName: "YuanYuan",
            lastName: "Lin"
        }, {
            firstName: "Harambe",
            lastName: "McHarambe"
        }, {
            firstName: "Gosha",
            lastName: "Tubelsky"
        }]
    };

    var disposeQ, newState;

    const fullName = dynode('fullName', n => `${ n.firstName } ${ n.lastName }`);
    const employeeList = dynode('employeeList', n => n.employees.map(fullName).join(', '));

    beforeEach(() => {
        newState = observable(cloneDeep(state));
        disposeQ = [];
    });

    afterEach(() => {
        disposeQ.forEach(dispose => dispose());
    })

    it('returns resolved value', () => {
        expect(fullName(newState.employees[0])).toBe('YuanYuan Lin');
    });
    
    it('does not recreate existing property', () => {
        const fullName2 = dynode('fullName', n => n.firstName);
        const emp1 = newState.employees[0];
        expect(fullName(emp1)).toBe('YuanYuan Lin');
        expect(fullName2(emp1)).toBe('YuanYuan Lin'); // no overwrite
    });

    it('updates reactively', (done) => {
        const emp1 = newState.employees[0];
        disposeQ.push(
            observe(emp1, (change) => {
                expect(fullName(change.object)).toBe('YuanYuan Lam');
                done();
            })
        );
        expect(fullName(emp1)).toBe('YuanYuan Lin');
        emp1.lastName = 'Lam';
    });
    
    it('composes', () => {
        expect(employeeList(newState)).toBe('YuanYuan Lin, Harambe McHarambe, Gosha Tubelsky');
    });
});