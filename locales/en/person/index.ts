import firstName from './FirstName.js'
import lastName from './LastName.js'
import gender from './Gender.js'
import title from './Title.js'
import { LocalePerson } from '../../Types.js'
const suffixes = ['Jr.', 'Sr.', 'I', 'II', 'III', 'IV', 'V', 'MD', 'DDS', 'PhD', 'DVM']
const time: LocalePerson = {
  gender,
  firstName,
  lastName,
  title,
  suffix: {
    general: suffixes,
    female: suffixes,
    male: suffixes,
  },
  prefix: {
    general: ['Mr.', 'Mrs.', 'Ms.', 'Miss', 'Dr.'],
    female: ['Mrs.', 'Ms.', 'Miss'],
    male: ['Mr.', 'Dr.'],
  },
  templates: [
    '#{prefix} #{first_name} #{last_name}',
    '#{first_name} #{last_name} #{suffix}',
    '#{first_name} #{last_name}',
    '#{first_name} #{last_name}',
    '#{male_first_name} #{last_name}',
    '#{female_first_name} #{last_name}',
  ],
}

export default time
