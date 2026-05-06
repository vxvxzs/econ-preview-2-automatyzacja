'use server'

export async function submitQuestionnaire(formData: any) {
  // Simulate a delay for realism
  await new Promise((resolve) => setTimeout(resolve, 1500))

  console.log('Questionnaire Submitted:', formData)

  // In a real app, you would send an email, save to DB, or trigger a webhook here
  return { success: true }
}
