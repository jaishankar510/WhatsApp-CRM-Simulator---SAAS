export const mockTemplates = [
  { id: 1, name: 'Welcome Template', body: 'Hello {{name}}, welcome!', status: 'approved' },
  { id: 2, name: 'Order Confirmation', body: 'Order #{{order_id}} confirmed', status: 'pending' }
]

export const mockSequences = [
  { id: 1, name: 'Welcome Sequence', status: 'completed', active: true },
  { id: 2, name: 'Abandoned Cart', status: 'pending', active: true }
]

export const mockSubcategories = {
  'Marketing & Advertising': ['Digital Marketing', 'SEO', 'Social Media'],
  'Retail': ['E-commerce', 'Fashion', 'Grocery'],
  'Technology': ['SaaS', 'Hardware', 'IT Services']
}