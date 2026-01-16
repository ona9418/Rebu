import LessonList from '../../../../components/LessonList';
import { MODULES } from '../../../../constants/Curriculum';

export default function RiskTab() {
  return <LessonList moduleData={MODULES[2]} />;
}