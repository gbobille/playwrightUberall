import { expect } from '@playwright/test';
import Ajv from 'ajv';

//shouldn't we delegate the responsibility of validation to each schema? I think abstracting this much complicates the navigation thru the project
export default class schemaUtils {

    async validateSchema(schemaPath:string, json:JSON) {
        const ajv = new Ajv()
        const valid = ajv.validate(require('../schemas/' + schemaPath), json)
        expect(valid).toBe(true)
    }

}