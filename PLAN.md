# Salary Take-Home Calculator - Implementation Plan

## Updated Requirements
- ✅ Manual "Calculate" button (not auto-trigger)
- ✅ Rate limiting for API calls
- ✅ Local storage caching for searched cities

## Phase 2: Implementation Checklist

### Setup & Configuration
- [x] 1. Verify Next.js project structure and dependencies
- [x] 2. Set up environment variables (.env.local with API_NINJAS_KEY)
- [x] 3. Configure TypeScript and Tailwind CSS
- [x] 3a. Create rate limiting utility (`lib/rateLimit.ts`)
- [x] 3b. Create local storage caching utility (`lib/cache.ts`)

### Core Library Files
- [x] 4. Create `lib/types.ts` with all TypeScript interfaces
- [x] 5. Create `lib/cities.ts` with hardcoded city data (25 cities)
- [x] 6. Create `lib/utils.ts` with helper functions (formatCurrency, calculateAfterRent)

### API Layer
- [ ] 7. Create `app/api/calculate-tax/route.ts` (Next.js API route)
- [ ] 8. Test API route with sample request

### UI Components (Dumb Components)
- [ ] 9. Create `components/SalaryInput.tsx` (salary + filing status inputs)
- [ ] 10. Create `components/CityColumn.tsx` (individual city comparison card)
- [ ] 11. Create `components/AddCityButton.tsx` (add city button)

### Main Page (Smart Container)
- [ ] 12. Update `app/page.tsx` with state management
- [ ] 13. Implement API call logic with AbortController (race condition handling)
- [ ] 14. Implement add/remove city logic
- [ ] 15. Wire up all components together

### Polish & Testing
- [ ] 16. Add responsive design (mobile/tablet/desktop breakpoints)
- [ ] 17. Test all edge cases (network errors, invalid input, etc.)
- [ ] 18. Verify accessibility (semantic HTML, aria-labels)
- [ ] 19. Final manual testing of complete user flow

---

**Status**: Ready for implementation
**Next Step**: Awaiting instruction on which item to start
