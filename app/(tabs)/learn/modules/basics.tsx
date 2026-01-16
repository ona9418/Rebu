import LessonList from '../../../../components/LessonList';
import { MODULES } from '../../../../constants/Curriculum';

export default function BasicsTab() {
  return <LessonList moduleData={MODULES[0]} />;
}