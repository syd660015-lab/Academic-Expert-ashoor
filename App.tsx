import React, { useMemo, useState } from 'react';

type SubjectPlan = {
  id: number;
  name: string;
  periodsPerClass: number;
  teachersCount: number;
  teacherWeeklyLoad: number;
};

type SchoolPlan = {
  id: number;
  name: string;
  studentsCount: number;
  classesCount: number;
  subjects: SubjectPlan[];
};

const numberFormatter = new Intl.NumberFormat('ar-EG');

const App: React.FC = () => {
  const [schools, setSchools] = useState<SchoolPlan[]>([]);
  const [activeSchoolId, setActiveSchoolId] = useState<number | null>(null);

  const [schoolName, setSchoolName] = useState('');
  const [studentsCount, setStudentsCount] = useState<number>(0);
  const [classesCount, setClassesCount] = useState<number>(0);

  const [subjectName, setSubjectName] = useState('');
  const [periodsPerClass, setPeriodsPerClass] = useState<number>(0);
  const [teachersCount, setTeachersCount] = useState<number>(0);
  const [teacherWeeklyLoad, setTeacherWeeklyLoad] = useState<number>(0);

  const activeSchool = schools.find((school) => school.id === activeSchoolId) ?? null;

  const addSchool = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!schoolName.trim() || studentsCount <= 0 || classesCount <= 0) return;

    const newSchool: SchoolPlan = {
      id: Date.now(),
      name: schoolName.trim(),
      studentsCount,
      classesCount,
      subjects: [],
    };

    setSchools((prev) => [...prev, newSchool]);
    setActiveSchoolId(newSchool.id);
    setSchoolName('');
    setStudentsCount(0);
    setClassesCount(0);
  };

  const addSubject = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeSchool || !subjectName.trim() || periodsPerClass <= 0 || teachersCount <= 0 || teacherWeeklyLoad <= 0) return;

    const subject: SubjectPlan = {
      id: Date.now(),
      name: subjectName.trim(),
      periodsPerClass,
      teachersCount,
      teacherWeeklyLoad,
    };

    setSchools((prev) =>
      prev.map((school) =>
        school.id === activeSchool.id
          ? {
              ...school,
              subjects: [...school.subjects, subject],
            }
          : school,
      ),
    );

    setSubjectName('');
    setPeriodsPerClass(0);
    setTeachersCount(0);
    setTeacherWeeklyLoad(0);
  };

  const removeSubject = (subjectId: number) => {
    if (!activeSchool) return;
    setSchools((prev) =>
      prev.map((school) =>
        school.id === activeSchool.id
          ? {
              ...school,
              subjects: school.subjects.filter((subject) => subject.id !== subjectId),
            }
          : school,
      ),
    );
  };

  const schoolTotals = useMemo(() => {
    if (!activeSchool) return null;

    const required = activeSchool.subjects.reduce(
      (sum, subject) => sum + activeSchool.classesCount * subject.periodsPerClass,
      0,
    );
    const available = activeSchool.subjects.reduce(
      (sum, subject) => sum + subject.teachersCount * subject.teacherWeeklyLoad,
      0,
    );

    return {
      required,
      available,
      gap: available - required,
      studentsPerClass: activeSchool.studentsCount / activeSchool.classesCount,
    };
  }, [activeSchool]);

  const globalTotals = useMemo(() => {
    let required = 0;
    let available = 0;

    schools.forEach((school) => {
      school.subjects.forEach((subject) => {
        required += school.classesCount * subject.periodsPerClass;
        available += subject.teachersCount * subject.teacherWeeklyLoad;
      });
    });

    return { required, available, gap: available - required };
  }, [schools]);

  return (
    <main style={{ fontFamily: 'Tahoma, Arial, sans-serif', margin: '0 auto', maxWidth: 1200, padding: '1rem' }} dir="rtl">
      <h1>نظام حساب العجز والزيادة - مدارس إدارة العريش التعليمية (المرحلة الإعدادية)</h1>
      <p>
        أدخل بيانات كل مدرسة ثم أضف المواد الدراسية ونصاب الحصص لكل معلم. سيقوم التطبيق بحساب إجمالي
        الاحتياج الفعلي، المتاح، والعجز/الزيادة لكل مدرسة وعلى مستوى الإدارة.
      </p>

      <section style={{ border: '1px solid #ccc', borderRadius: 12, padding: '1rem', marginBottom: '1rem' }}>
        <h2>إضافة مدرسة</h2>
        <form onSubmit={addSchool} style={{ display: 'grid', gap: '.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))' }}>
          <label>
            اسم المدرسة
            <input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} placeholder="مثال: مدرسة العريش الإعدادية بنات" required style={{ width: '100%' }} />
          </label>
          <label>
            عدد التلاميذ
            <input type="number" min={1} value={studentsCount || ''} onChange={(e) => setStudentsCount(Number(e.target.value))} required style={{ width: '100%' }} />
          </label>
          <label>
            عدد الفصول
            <input type="number" min={1} value={classesCount || ''} onChange={(e) => setClassesCount(Number(e.target.value))} required style={{ width: '100%' }} />
          </label>
          <button type="submit">حفظ المدرسة</button>
        </form>
      </section>

      <section style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 2fr' }}>
        <article style={{ border: '1px solid #ccc', borderRadius: 12, padding: '1rem' }}>
          <h2>المدارس المسجلة</h2>
          {schools.length === 0 ? (
            <p>لا توجد مدارس مضافة حتى الآن.</p>
          ) : (
            <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'grid', gap: '.5rem' }}>
              {schools.map((school) => (
                <li key={school.id}>
                  <button
                    type="button"
                    onClick={() => setActiveSchoolId(school.id)}
                    style={{
                      width: '100%',
                      textAlign: 'right',
                      background: activeSchoolId === school.id ? '#d8ebff' : '#f7f7f7',
                      border: '1px solid #ddd',
                      borderRadius: 8,
                      padding: '.5rem',
                    }}
                  >
                    <strong>{school.name}</strong>
                    <br />
                    التلاميذ: {numberFormatter.format(school.studentsCount)} | الفصول:{' '}
                    {numberFormatter.format(school.classesCount)}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article style={{ border: '1px solid #ccc', borderRadius: 12, padding: '1rem' }}>
          <h2>تفاصيل المدرسة المختارة</h2>
          {!activeSchool ? (
            <p>اختر مدرسة لإضافة المواد الدراسية وحساب العجز/الزيادة.</p>
          ) : (
            <>
              <h3>{activeSchool.name}</h3>

              <form onSubmit={addSubject} style={{ display: 'grid', gap: '.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', marginBottom: '1rem' }}>
                <label>
                  المادة
                  <input value={subjectName} onChange={(e) => setSubjectName(e.target.value)} placeholder="مثال: الرياضيات" required style={{ width: '100%' }} />
                </label>
                <label>
                  حصص المادة لكل فصل أسبوعيًا
                  <input type="number" min={1} value={periodsPerClass || ''} onChange={(e) => setPeriodsPerClass(Number(e.target.value))} required style={{ width: '100%' }} />
                </label>
                <label>
                  عدد المعلمين
                  <input type="number" min={1} value={teachersCount || ''} onChange={(e) => setTeachersCount(Number(e.target.value))} required style={{ width: '100%' }} />
                </label>
                <label>
                  نصاب الحصص لكل معلم أسبوعيًا
                  <input type="number" min={1} value={teacherWeeklyLoad || ''} onChange={(e) => setTeacherWeeklyLoad(Number(e.target.value))} required style={{ width: '100%' }} />
                </label>
                <button type="submit">إضافة المادة</button>
              </form>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ borderBottom: '1px solid #ccc' }}>المادة</th>
                      <th style={{ borderBottom: '1px solid #ccc' }}>الاحتياج الفعلي</th>
                      <th style={{ borderBottom: '1px solid #ccc' }}>المتاح</th>
                      <th style={{ borderBottom: '1px solid #ccc' }}>العجز / الزيادة</th>
                      <th style={{ borderBottom: '1px solid #ccc' }}>إجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeSchool.subjects.map((subject) => {
                      const required = activeSchool.classesCount * subject.periodsPerClass;
                      const available = subject.teachersCount * subject.teacherWeeklyLoad;
                      const gap = available - required;

                      return (
                        <tr key={subject.id}>
                          <td>{subject.name}</td>
                          <td>{numberFormatter.format(required)} حصة</td>
                          <td>{numberFormatter.format(available)} حصة</td>
                          <td style={{ color: gap < 0 ? '#b00020' : '#0a5f0a', fontWeight: 700 }}>
                            {gap < 0 ? `عجز ${numberFormatter.format(Math.abs(gap))}` : `زيادة ${numberFormatter.format(gap)}`}
                          </td>
                          <td>
                            <button type="button" onClick={() => removeSubject(subject.id)}>
                              حذف
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {activeSchool.subjects.length === 0 && (
                      <tr>
                        <td colSpan={5}>لا توجد مواد مضافة لهذه المدرسة.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {schoolTotals && (
                <div style={{ marginTop: '1rem', background: '#f5f9ff', padding: '.75rem', borderRadius: 8 }}>
                  <strong>ملخص المدرسة:</strong>
                  <div>إجمالي الاحتياج: {numberFormatter.format(schoolTotals.required)} حصة</div>
                  <div>إجمالي المتاح: {numberFormatter.format(schoolTotals.available)} حصة</div>
                  <div>
                    الحالة: {schoolTotals.gap < 0 ? `عجز ${numberFormatter.format(Math.abs(schoolTotals.gap))}` : `زيادة ${numberFormatter.format(schoolTotals.gap)}`}
                  </div>
                  <div>متوسط كثافة الفصل: {schoolTotals.studentsPerClass.toFixed(1)} تلميذ/فصل</div>
                </div>
              )}
            </>
          )}
        </article>
      </section>

      <section style={{ marginTop: '1rem', border: '1px solid #ccc', borderRadius: 12, padding: '1rem' }}>
        <h2>إجمالي الإدارة التعليمية</h2>
        <p>الاحتياج الكلي: {numberFormatter.format(globalTotals.required)} حصة أسبوعيًا</p>
        <p>المتاح الكلي: {numberFormatter.format(globalTotals.available)} حصة أسبوعيًا</p>
        <p style={{ fontWeight: 700, color: globalTotals.gap < 0 ? '#b00020' : '#0a5f0a' }}>
          {globalTotals.gap < 0
            ? `إجمالي العجز: ${numberFormatter.format(Math.abs(globalTotals.gap))} حصة`
            : `إجمالي الزيادة: ${numberFormatter.format(globalTotals.gap)} حصة`}
        </p>
      </section>
    </main>
  );
};

export default App;
