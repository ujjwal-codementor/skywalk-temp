# Service Agreement PDF

Place your `service-agreement-v1.pdf` file in this directory.

The PDF should contain your furniture touch-up subscription service agreement with the following sections:

- Company information
- Customer information fields
- Service description and coverage
- Terms and conditions
- Signature lines for both customer and company representative

**Important:** The API route expects to find a file named exactly `service-agreement-v1.pdf` in this directory.

## PDF Layout Considerations

When creating your PDF, consider the positioning of:
- Customer name field (around Y coordinate: height - 150)
- Email field (around Y coordinate: height - 170)  
- Customer signature line (around Y coordinate: height - 200)
- Company signature line (around Y coordinate: height - 220)
- Date field (around Y coordinate: height - 240)
- IP address field (around Y coordinate: height - 260)

The API will automatically stamp these fields onto the PDF when a customer signs the agreement.

## File Structure
```
public/
  agreements/
    service-agreement-v1.pdf  ← Your actual agreement PDF goes here
    README.md                 ← This file
```



