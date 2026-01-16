import LessonList from '../../../../components/LessonList';
import { MODULES } from '../../../../constants/Curriculum';

export default function AnalysisTab() {
  return <LessonList moduleData={MODULES[1]} />;
}